(function (root) {
  'use strict';
  const TABLE = 'yuetread_scripts';
  const fields = 'id,title,source,converted,saved_at,deleted_at';
  const fromRow = row => ({ id: row.id, title: row.title, source: row.source, converted: row.converted, savedAt: row.saved_at });

  class CloudLibrary {
    constructor({ client, storage, onChange = () => {}, online = () => true }) {
      this.client = client; this.storage = storage; this.onChange = onChange; this.online = online;
      this.user = null; this.scripts = []; this.pending = {}; this.lastSync = null;
      this.status = 'signed-out'; this.generation = 0; this.running = null;
    }

    get cacheKey() { return `yuetread_cloud_v1_${this.user.id}`; }
    emit() { this.onChange(this); }
    persist() {
      this.storage.setItem(this.cacheKey, JSON.stringify({ scripts: this.scripts, pending: this.pending, lastSync: this.lastSync }));
    }

    setUser(user) {
      if ((this.user?.id || null) === (user?.id || null)) return;
      this.generation++; this.running = null;
      this.user = user; this.scripts = []; this.pending = {}; this.lastSync = null;
      if (user) {
        try {
          const cache = JSON.parse(this.storage.getItem(this.cacheKey) || '{}');
          this.scripts = Array.isArray(cache.scripts) ? cache.scripts.filter(script => typeof script.id === 'string' && typeof script.source === 'string') : [];
          this.pending = cache.pending && typeof cache.pending === 'object' ? cache.pending : {};
          this.lastSync = cache.lastSync || null;
        } catch (_) { /* A broken cache must not prevent server recovery. */ }
      }
      this.status = user ? 'ready' : 'signed-out'; this.emit();
    }

    queue(script, deleted = false) {
      if (!this.user) throw new Error('SIGN_IN_REQUIRED');
      if (!script.id || !script.source || script.source.length > 20000 || (script.converted || '').length > 20000) throw new Error('INVALID_SCRIPT');
      const oldScripts = this.scripts, oldPending = this.pending;
      this.scripts = this.scripts.filter(item => item.id !== script.id);
      if (!deleted) this.scripts = [script, ...this.scripts];
      this.pending = { ...this.pending, [script.id]: { script, deleted, operation: root.crypto.randomUUID() } };
      try { this.persist(); }
      catch (error) { this.scripts = oldScripts; this.pending = oldPending; throw error; }
      this.status = this.online() ? 'pending' : 'offline'; this.emit();
      return this.sync();
    }

    async sync() {
      if (!this.user) return false;
      if (!this.online()) { this.status = 'offline'; this.emit(); return false; }
      if (this.running) return this.running;
      const generation = this.generation;
      const uid = this.user.id;
      const stillCurrent = () => this.generation === generation && this.user?.id === uid;
      this.status = 'syncing'; this.emit();
      const run = async () => {
        try {
          for (const [id, operation] of Object.entries(this.pending)) {
            if (!stillCurrent()) return false;
            const script = operation.script;
            const { error } = await this.client.from(TABLE).upsert({
              user_id: uid, id, title: script.title, source: script.source, converted: script.converted || '',
              saved_at: script.savedAt, deleted_at: operation.deleted ? new Date().toISOString() : null
            }, { onConflict: 'user_id,id' });
            if (!stillCurrent()) return false;
            if (error) throw error;
            if (this.pending[id]?.operation === operation.operation) {
              const remaining = { ...this.pending }; delete remaining[id]; this.pending = remaining; this.persist();
            }
          }
          const rows = [];
          for (let start = 0; ; start += 200) {
            const { data, error } = await this.client.from(TABLE).select(fields).eq('user_id', uid)
              .is('deleted_at', null).order('saved_at', { ascending: false }).order('id').range(start, start + 199);
            if (!stillCurrent()) return false;
            if (error) throw error;
            if (!Array.isArray(data)) throw new Error('INVALID_RESPONSE');
            rows.push(...data);
            if (data.length < 200) break;
          }
          const merged = new Map(rows.map(row => [row.id, fromRow(row)]));
          // Writes made while the server was replying take precedence locally.
          for (const [id, operation] of Object.entries(this.pending)) {
            if (operation.deleted) merged.delete(id); else merged.set(id, operation.script);
          }
          this.scripts = [...merged.values()].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
          this.lastSync = new Date().toISOString(); this.persist();
          this.status = Object.keys(this.pending).length ? 'pending' : 'synced';
          this.emit(); return true;
        } catch (_) {
          if (stillCurrent()) { this.status = this.online() ? 'error' : 'offline'; this.emit(); }
          return false;
        }
      };
      this.running = run();
      const running = this.running;
      const success = await running;
      if (stillCurrent() && this.running === running) {
        this.running = null;
        if (success && Object.keys(this.pending).length) setTimeout(() => this.sync(), 0);
      }
      return success;
    }
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { CloudLibrary };
  else root.YuetReadCloudLibrary = CloudLibrary;
})(globalThis);
