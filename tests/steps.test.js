import test from "node:test";
import assert from "node:assert/strict";
import { validateSteps } from "../src/features/activities/validators.js";

function step() {
  return {
    id: crypto.randomUUID(),
    title: "",
    instruction: "Siapkan buku.",
    helpText: "",
    icon: "book",
  };
}

test("judul dan bantuan boleh kosong, instruksi tetap wajib", () => {
  const card = step();
  assert.equal(validateSteps([card]).valid, true);

  card.instruction = "   ";
  const result = validateSteps([card]);

  assert.equal(result.valid, false);
  assert.ok(result.errors[0].instruction);
});

test("menolak daftar kosong dan jumlah kartu berlebihan", () => {
  assert.equal(validateSteps([]).valid, false);
  assert.equal(
    validateSteps(Array.from({ length: 21 }, step)).valid,
    false,
  );
});

test("menolak ikon asing dan ID duplikat", () => {
  const card = step();

  assert.equal(
    validateSteps([{ ...card, icon: "ikon-asing" }]).valid,
    false,
  );

  assert.equal(validateSteps([card, { ...card }]).valid, false);
});

test("menolak instruksi terlalu panjang dan data kartu rusak", () => {
  assert.equal(
    validateSteps([{ ...step(), instruction: "a".repeat(301) }]).valid,
    false,
  );
  assert.equal(validateSteps([null]).valid, false);
});