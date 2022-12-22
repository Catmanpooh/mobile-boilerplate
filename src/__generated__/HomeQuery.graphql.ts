/**
 * @generated SignedSource<<20d6a9a9c1113d607338d867caee9431>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type HomeQuery$variables = {
  userId: string;
};
export type HomeQuery$data = {
  readonly user: {
    readonly userName: string;
    readonly firstName: string;
    readonly lastName: string;
  };
  readonly photos: ReadonlyArray<{
    readonly id: string;
    readonly file: string;
    readonly createdAt: any;
  }>;
};
export type HomeQuery = {
  variables: HomeQuery$variables;
  response: HomeQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "userId"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "userName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "firstName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastName",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "userId",
        "variableName": "userId"
      }
    ],
    "concreteType": "Photo",
    "kind": "LinkedField",
    "name": "photos",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "file",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HomeQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "HomeQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c16abf03311db7ebaeb4c7ee080940cc",
    "id": null,
    "metadata": {},
    "name": "HomeQuery",
    "operationKind": "query",
    "text": "query HomeQuery(\n  $userId: String!\n) {\n  user(id: $userId) {\n    userName\n    firstName\n    lastName\n  }\n  photos(userId: $userId) {\n    id\n    file\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "99ca72bc56367784773d78ebe913b5dd";

export default node;
