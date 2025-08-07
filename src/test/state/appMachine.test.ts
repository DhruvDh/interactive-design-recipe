import { describe, it, expect } from "vitest";
import { createActor } from "xstate";
import { appMachine } from "../../state/appMachine";

describe("appMachine", () => {
  describe("idle state", () => {
    it("transitions to selecting on PICK", () => {
      const actor = createActor(appMachine);
      actor.start();

      expect(actor.getSnapshot().value).toBe("idle");

      actor.send({ type: "PICK" });

      expect(actor.getSnapshot().value).toBe("selecting");
    });

    it("transitions to analysing on SELECTED (auto-reconnect path)", () => {
      const actor = createActor(appMachine);
      actor.start();

      expect(actor.getSnapshot().value).toBe("idle");

      const mockHandle = {} as FileSystemDirectoryHandle;
      const mockFiles = [new File(["content"], "test.java")];
      const mockDirKey = "test-dir-key";

      actor.send({
        type: "SELECTED",
        dir: mockHandle,
        files: mockFiles,
        dirKey: mockDirKey,
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe("analysing");
      expect(snapshot.context.dir).toBe(mockHandle);
      expect(snapshot.context.files).toBe(mockFiles);
      expect(snapshot.context.dirKey).toBe(mockDirKey);
    });
  });

  describe("selecting state", () => {
    it("transitions to analysing on SELECTED", () => {
      const actor = createActor(appMachine);
      actor.start();

      // First transition to selecting
      actor.send({ type: "PICK" });
      expect(actor.getSnapshot().value).toBe("selecting");

      const mockHandle = {} as FileSystemDirectoryHandle;
      const mockFiles = [new File(["content"], "test.java")];
      const mockDirKey = "test-dir-key";

      actor.send({
        type: "SELECTED",
        dir: mockHandle,
        files: mockFiles,
        dirKey: mockDirKey,
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe("analysing");
      expect(snapshot.context.dir).toBe(mockHandle);
      expect(snapshot.context.files).toBe(mockFiles);
      expect(snapshot.context.dirKey).toBe(mockDirKey);
    });

    it("transitions back to idle on CANCEL", () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: "PICK" });
      expect(actor.getSnapshot().value).toBe("selecting");

      actor.send({ type: "CANCEL" });
      expect(actor.getSnapshot().value).toBe("idle");
    });
  });

  describe("analysing state", () => {
    it("transitions to ready on PARSE_OK", () => {
      const actor = createActor(appMachine);
      actor.start();

      // Transition through idle → analysing
      actor.send({
        type: "SELECTED",
        dir: {} as FileSystemDirectoryHandle,
        files: [],
        dirKey: "test-key",
      });
      expect(actor.getSnapshot().value).toBe("analysing");

      const mockAnalysis = { classes: [], interfaces: [], imports: [] };
      actor.send({ type: "PARSE_OK", analysis: mockAnalysis });

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe("ready");
      expect(snapshot.context.analysis).toBe(mockAnalysis);
    });

    it("transitions to idle on PARSE_FAIL", () => {
      const actor = createActor(appMachine);
      actor.start();

      // Transition through idle → analysing
      actor.send({
        type: "SELECTED",
        dir: {} as FileSystemDirectoryHandle,
        files: [],
        dirKey: "test-key",
      });
      expect(actor.getSnapshot().value).toBe("analysing");

      actor.send({ type: "PARSE_FAIL", message: "Parse error" });
      expect(actor.getSnapshot().value).toBe("idle");
    });
  });
});
