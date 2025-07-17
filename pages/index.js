"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var app_1 = require("firebase/app");
var functions_1 = require("firebase/functions");
var firebaseConfig = {
    // Replace with your Firebase config from Firebase Studio
    apiKey: "AIzaSyD3FvJeVGcm_nXdfrnqbuKTPrR_7vZLxNg",
    authDomain: "reconnaissance-automation.firebaseapp.com",
    projectId: "reconnaissance-automation",
    storageBucket: "reconnaissance-automation.firebasestorage.app",
    messagingSenderId: "854844428975",
    appId: "1:854844428975:web:9f88578eeb930df553ba5a"
};
var app = (0, app_1.initializeApp)(firebaseConfig);
var functions = (0, functions_1.getFunctions)(app);
var Home = function () {
    var _a = (0, react_1.useState)({ activeRoster: [], voteResults: { message: 'No recent vote results available.' } }), data = _a[0], setData = _a[1];
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api')];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        setData(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Failed to fetch data:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
        var interval = setInterval(fetchData, 60000); // Refresh every minute
        return function () { return clearInterval(interval); };
    }, []);
    return (<div className="min-h-screen bg-[#1B4D3E] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Reconnaissance Sniper Unit Dashboard</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Active Roster</h2>
          <div className="bg-[#2A3D33] p-4 rounded-lg shadow-lg">
            <ul className="list-disc pl-6">
              {data.activeRoster.map(function (user, index) { return (<li key={index} className="mb-2">{user}</li>); })}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Event Voting Results</h2>
          <div className="bg-[#2A3D33] p-4 rounded-lg shadow-lg">
            {data.voteResults.message ? (<p>{data.voteResults.message}</p>) : (<>
                <ul className="list-none mb-4">
                  {Object.entries(data.voteResults.reactionCounts || {}).map(function (_a) {
                var emoji = _a[0], count = _a[1];
                var event = EVENT_LIST.find(function (e) { return e.emoji === emoji; });
                return (<li key={emoji} className="mb-2">
                        {event === null || event === void 0 ? void 0 : event.name}: {count} vote{count === 1 ? '' : 's'}
                      </li>);
            })}
                </ul>
                <p className="text-sm">
                  Voters: {Object.entries(data.voteResults.voters || {})
                .filter(function (_a) {
                var _ = _a[0], voters = _a[1];
                return voters.length;
            })
                .map(function (_a) {
                var emoji = _a[0], voters = _a[1];
                return "".concat(emoji, ": ").concat(voters.join(', '));
            })
                .join(' | ') || 'No votes recorded.'}
                </p>
                <p className="text-sm mt-2">Last updated: {data.voteResults.timestamp ? new Date(data.voteResults.timestamp).toLocaleString() : 'N/A'}</p>
              </>)}
          </div>
        </div>
      </div>
    </div>);
};
var EVENT_LIST = [
    { name: 'RT - Recon Riot', emoji: '🎯' },
    { name: 'RP - Recon Printing', emoji: '🖨️' },
    { name: 'CT - Combat Training', emoji: '⚔️' },
    { name: 'JCE - Joint City Event', emoji: '🏙️' },
    { name: 'JCT - Joint Combat Training', emoji: '🛡️' },
    { name: 'Gamenight', emoji: '🎮' }
];
exports.default = Home;
