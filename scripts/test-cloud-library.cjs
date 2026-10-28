const assert = require('node:assert/strict');
const { CloudLibrary } = require('../cloud-library.js');

const store = new Map();
const storage = { getItem: key => store.get(key) || null, setItem: (key, value) => store.set(key, value) };
const records = new Map();
let isOnline = true, failWrites = false, failReads = false;
const client = {
  from(table) {
    assert.equal(table, 'yuetread_scripts');
    return {
      async upsert(row, options) {
        assert.equal(options.onConflict, 'user_id,id');
        if (failWrites) return { error: new Error('offline') };
        const previous = records.get(`${row.user_id}:${row.id}`);
        // Mirrors schema.sql's delete-wins trigger for stale offline writes.
        records.set(`${row.user_id}:${row.id}`, { ...row, deleted_at: previous?.deleted_at || row.deleted_at });
        return { error: null };
      },
      select() {
        let uid;
        const query = {
          eq(field, value) { assert.equal(field, 'user_id'); uid = value; return query; },
          is(field, value) { assert.equal(field, 'deleted_at'); assert.equal(value, null); return query; },
          order() { return query; },
          async range(start, end) {
            if (failReads) return { data: null, error: new Error('network') };
            return { data: [...records.values()].filter(row => row.user_id === uid && !row.deleted_at).sort((a, b) => a.id.localeCompare(b.id)).slice(start, end + 1), error: null };
          }
        };
        return query;
      }
    };
  }
};
const script = (id, title = '測試稿') => ({ id, title, source: '大家好，今日分享。', converted: '大家好，今天分享。', savedAt: '2026-10-28T00:00:00Z' });
const library = () => new CloudLibrary({ client, storage, online: () => isOnline });

(async () => {
  const deviceA = library(); deviceA.setUser({ id: 'owner-a', email: 'a@example.com' });
  isOnline = false;
  await deviceA.queue(script('one'));
  assert.equal(deviceA.status, 'offline');
  assert.equal(records.size, 0);
  assert.equal(deviceA.scripts.length, 1);
  const reloaded = library(); reloaded.setUser({ id: 'owner-a' });
  assert.equal(reloaded.scripts.length, 1, 'offline documents survive reload');
  isOnline = true; await reloaded.sync();
  assert.equal(reloaded.status, 'synced');
  assert.equal(Object.keys(reloaded.pending).length, 0);
  const deviceB = library(); deviceB.setUser({ id: 'owner-a' }); await deviceB.sync();
  assert.equal(deviceB.scripts[0].source, script('one').source, 'a second device retrieves the same document');
  deviceB.setUser({ id: 'owner-b' }); await deviceB.sync();
  assert.equal(deviceB.scripts.length, 0, 'another account cannot inherit the previous account cache');
  await reloaded.queue(script('one'), true);
  await deviceA.sync();
  assert.equal(deviceA.scripts.length, 0, 'deletions propagate across devices');
  assert.ok(records.get('owner-a:one').deleted_at, 'server deletion is a recoverable tombstone');
  failWrites = true;
  await reloaded.queue(script('retry'));
  assert.equal(reloaded.status, 'error');
  assert.equal(Object.keys(reloaded.pending).length, 1, 'failed uploads remain queued');
  failWrites = false; await reloaded.sync();
  assert.equal(reloaded.status, 'synced');
  const previous = [...reloaded.scripts]; failReads = true; await reloaded.sync();
  assert.deepEqual(reloaded.scripts, previous, 'a failed read cannot erase cached documents'); failReads = false;
  for (let i = 0; i < 205; i++) records.set(`owner-a:bulk-${i}`, { user_id: 'owner-a', ...script(`bulk-${i}`), saved_at: script('x').savedAt, deleted_at: null });
  await reloaded.sync(); assert.equal(reloaded.scripts.length, 206, 'cloud library is paginated beyond 200 documents');
  reloaded.setUser(null); assert.equal(reloaded.scripts.length, 0);
  assert.throws(() => reloaded.queue(script('blocked')), /SIGN_IN_REQUIRED/);
  const fullStorage = library(); fullStorage.setUser({ id: 'storage-test' });
  fullStorage.storage = { getItem: () => null, setItem: () => { throw new Error('quota'); } };
  assert.throws(() => fullStorage.queue(script('full')), /quota/);
  assert.equal(fullStorage.scripts.length, 0, 'quota failures are not falsely shown as successful saves');
  console.log('PASS: offline recovery, cross-device sync, account isolation, deletion propagation, retries, failed reads, pagination and storage failure');
})().catch(error => { console.error(error); process.exitCode = 1; });
