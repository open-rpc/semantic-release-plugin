
export default {
  ENODOCUMENT: () => ({
    code: "ENODOCUMENT",
    message: "Missing `openrpc.json` document file.",
    details: [
      "An [OpenRPC Document](https://spec.open-rpc.org/#openrpc-document) at the root of your project or specified in the config is required. ", //tslint:disable-line
      "Please follow the [OpenRPC Specification](http://spec.open-rpc.org) to create a valid `openrpc.json` file.",
    ].join("\n\n"),
  }),
};
