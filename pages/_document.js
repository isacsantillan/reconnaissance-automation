"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Document;
var document_1 = require("next/document");
function Document() {
    return (<document_1.Html lang="en">
      <document_1.Head />
      <body className="antialiased">
        <document_1.Main />
        <document_1.NextScript />
      </body>
    </document_1.Html>);
}
