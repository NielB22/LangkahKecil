import test from "node:test";
import assert from "node:assert/strict";
import { createActivityRepository } from "../src/features/activities/activityRepository.js";
import { generateActivity } from "../src/features/activities/generators.js";
import { STORAGE_KEY } from "../src/features/activities/models.js";

function makeStorage() {
  const data = new Map();

  return {
    getItem: (key) => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
  };
}

function draft() {
  return generateActivity({
    type: "book",
    title: "Latihan Matematika",
    formData: {
      subjectOrBook: "Matematika",
      page: "15",
      questionRange: "1–5",
      collectionInstruction: "",
    },
  });
}

test("aktivitas tetap tersedia melalui instance repository baru", () => {
  const storage = makeStorage();
  const first = createActivityRepository({
    getStorage: () => storage,
  });

  const activity = first.createActivity(draft());

  const reopened = createActivityRepository({
    getStorage: () => storage,
  });

  assert.deepEqual(reopened.getActivity(activity.id), activity);
  assert.equal(reopened.listActivities().length, 1);
});

test("update mempertahankan identitas, tanggal awal, dan edit kartu", () => {
  const storage = makeStorage();
  let timestamp = "2026-11-26T01:00:00.000Z";

  const repo = createActivityRepository({
    getStorage: () => storage,
    now: () => timestamp,
  });

  const original = repo.createActivity(draft());
  const steps = structuredClone(original.steps).reverse();
  steps[0].instruction = "Letakkan buku di rak kelas.";

  timestamp = "2026-11-26T02:00:00.000Z";

  const updated = repo.updateActivity(original.id, {
    title: "Aktivitas Diperbarui",
    steps,
    id: "jangan-ganti-id",
    createdAt: timestamp,
  });

  assert.equal(updated.id, original.id);
  assert.equal(updated.createdAt, original.createdAt);
  assert.equal(updated.updatedAt, timestamp);
  assert.deepEqual(repo.getActivity(original.id).steps, steps);
  assert.equal(repo.listActivities().length, 1);
});

test("delete hanya menghapus aktivitas yang dituju", () => {
  const storage = makeStorage();
  const repo = createActivityRepository({ getStorage: () => storage });

  const first = repo.createActivity(draft());
  const second = repo.createActivity(draft());

  assert.equal(repo.deleteActivity(first.id), true);
  assert.equal(repo.getActivity(first.id), null);
  assert.ok(repo.getActivity(second.id));
  assert.equal(repo.deleteActivity("tidak-ada"), false);
});

test("JSON rusak tidak ditimpa saat mencoba menyimpan", () => {
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, "{rusak");

  const repo = createActivityRepository({ getStorage: () => storage });

  assert.throws(
    () => repo.createActivity(draft()),
    { code: "CORRUPT_DATA" },
  );

  assert.equal(storage.getItem(STORAGE_KEY), "{rusak");
});

test("struktur data salah ditolak tanpa perubahan penyimpanan", () => {
  const storage = makeStorage();
  const raw = JSON.stringify({
    schemaVersion: 1,
    activities: [{}],
  });
  storage.setItem(STORAGE_KEY, raw);

  const repo = createActivityRepository({ getStorage: () => storage });

  assert.throws(() => repo.listActivities(), { code: "CORRUPT_DATA" });
  assert.equal(storage.getItem(STORAGE_KEY), raw);
});

test("kuota penuh tidak mengubah aktivitas yang sudah tersimpan", () => {
  const storage = makeStorage();
  const repo = createActivityRepository({ getStorage: () => storage });
  repo.createActivity(draft());

  const before = storage.getItem(STORAGE_KEY);

  storage.setItem = () => {
    throw Object.assign(new Error("Quota"), {
      name: "QuotaExceededError",
    });
  };

  assert.throws(
    () => repo.createActivity(draft()),
    { code: "STORAGE_FULL" },
  );
  assert.equal(storage.getItem(STORAGE_KEY), before);
});

test("penyimpanan diblokir dan ID tidak ditemukan ditangani", () => {
  const blocked = createActivityRepository({
    getStorage: () => { throw new Error("Blocked"); },
  });

  assert.throws(
    () => blocked.listActivities(),
    { code: "STORAGE_UNAVAILABLE" },
  );

  const storage = makeStorage();
  const repo = createActivityRepository({ getStorage: () => storage });

  assert.throws(
    () => repo.updateActivity("tidak-ada", {}),
    { code: "NOT_FOUND" },
  );

  const invalid = draft();
  invalid.steps[0].instruction = " ";
  assert.throws(
    () => repo.createActivity(invalid),
    { code: "VALIDATION_ERROR" },
  );
  assert.equal(storage.getItem(STORAGE_KEY), null);
});