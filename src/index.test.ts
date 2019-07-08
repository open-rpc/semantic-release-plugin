import { prepare, verifyConditions } from "./index";
import SemanticReleaseError from "./semanticReleaseError";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";

const appendFile = util.promisify(fs.appendFile);
const readFile = util.promisify(fs.readFile);

const p = path.resolve(process.cwd(), "./openrpc.json");

const touchFile = () => {
  fs.closeSync(fs.openSync(p, "w"));
};

const removeFile = () => {
  return fs.unlinkSync(p);
};

const testOpenRPC = {
  info: {
    version: "0.0.0-development",
  },
};

describe("openrpc plugin", () => {
  describe("verifyConditions", () => {
    it("can error on verifyConditions", () => {
      return verifyConditions({ documentLocation: "./openrpc.json" }, {}).catch((e: SemanticReleaseError) => {
        expect(e.message).toContain("Missing `openrpc.json` document file");
      });
    });
    it("can pass verifyConditions", () => {
      touchFile();
      return verifyConditions({ documentLocation: "./openrpc.json" }, {}).then((valid: boolean) => {
        expect(valid).toEqual(true);
        removeFile();
      });
    });
  });

  describe("prepare", () => {
    it("can fail if no next release version", () => {
      touchFile();
      return prepare({ documentLocation: "./openrpc.json" }, {}).catch((e: SemanticReleaseError) => {
        expect(e.message).toContain("No nextRelease version");
        removeFile();
      });
    });
    it("can pass prepare and set the version", async () => {
      touchFile();
      await appendFile(p, JSON.stringify(testOpenRPC, null, 4));
      return prepare({ documentLocation: "./openrpc.json" }, { nextRelease: { version: "1.0.0" } })
        .then(async (prepared: boolean) => {
          const file = await readFile(p);
          const openRPCFromFile = JSON.parse(file.toString());
          expect(openRPCFromFile.info.version).toEqual("1.0.0");
          removeFile();
        });
    });
  });

});
