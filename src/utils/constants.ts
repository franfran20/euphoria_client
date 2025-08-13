import { parseUnits } from "viem";

export const BOOK_GENRES: Record<number, string> = {
  0: "Fantasy",
  1: "Science Fiction",
  2: "Mystery",
  3: "Romance",
  4: "Historical Fiction",
  5: "Philosphy",
  6: "Thriller",
  7: "Adventure",
};

export const BOOK_GENRES_ARRAY = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Historical Fiction",
  "Philosphy",
  "Thriller",
  "Adventure",
];

export const GATED_URI = "Euphoria Official Site";

export const DECIMALS = 6;

export const THIRTY_MINUTES = 60 * 30;
export const DEADLINE = Math.floor(Date.now() / 1000) + THIRTY_MINUTES;

export const SUBSCRIPTION_COST = parseUnits("20", DECIMALS);

export const MOCK_USDC_ADDRESS = "0xF142710c99dEB5a8b829Cea2dcE9e74dECA0ff8f";

export const CONTRACT_ADDRESS = "0x9BC69c6Ba84d0e118763cf999093be9e743947dD";

export const CONTRACT_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_params",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.ConstructorParams",
        components: [
          { name: "token", type: "address", internalType: "address" },
          {
            name: "bookCreationCost",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "subscriptionCost",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "subscriptionVotes",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "subscriptionDuration",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "votingDelay",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "votingDuration",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DOMAIN_SEPARATOR",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createEuphoriaBook",
    inputs: [
      { name: "_chapterLock", type: "uint16", internalType: "uint16" },
      { name: "_name", type: "string", internalType: "string" },
      { name: "_coverImage", type: "string", internalType: "string" },
      { name: "_genres", type: "uint256[]", internalType: "uint256[]" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createEuphoriaBookWithSig",
    inputs: [
      { name: "_chapterLock", type: "uint16", internalType: "uint16" },
      { name: "_name", type: "string", internalType: "string" },
      { name: "_coverImage", type: "string", internalType: "string" },
      { name: "_genres", type: "uint256[]", internalType: "uint256[]" },
      {
        name: "_sig",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.SigParams",
        components: [
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "r", type: "bytes32", internalType: "bytes32" },
          { name: "s", type: "bytes32", internalType: "bytes32" },
          { name: "user", type: "address", internalType: "address" },
          { name: "v", type: "uint8", internalType: "uint8" },
        ],
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositIntoBalance",
    inputs: [
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_recipient", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBook",
    inputs: [{ name: "_bookId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.EuphoriaBook",
        components: [
          { name: "owner", type: "address", internalType: "address" },
          {
            name: "createdAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "chapterLock",
            type: "uint16",
            internalType: "uint16",
          },
          {
            name: "chaptersWritten",
            type: "uint16",
            internalType: "uint16",
          },
          {
            name: "genres",
            type: "uint256[]",
            internalType: "uint256[]",
          },
          { name: "completed", type: "bool", internalType: "bool" },
          {
            name: "lastPulledSeasonId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "earnings", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBookSeasonAmount",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_seasonId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getChapter",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_chapterId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCosts",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCurrentSeason",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.Season",
        components: [
          { name: "votes", type: "uint256", internalType: "uint256" },
          {
            name: "votesExcercised",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "votingStartsAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "votingEndsAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "seasonAllocationAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTimestamp",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUser",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.User",
        components: [
          {
            name: "depositedBalance",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "spendBacks",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "withdrawnBookEarnings",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "booksWritten",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "subscriptionEndsAt",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "isWriter", type: "bool", internalType: "bool" },
        ],
      },
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserVotes",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasAccess",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_user", type: "address", internalType: "address" },
      { name: "_chapterId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isUsernameTaken",
    inputs: [{ name: "_username", type: "string", internalType: "string" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mintTokensIntoBalance",
    inputs: [
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_recipient", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "pullSeasonsEarnings",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_toSeasonId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "registerWriter",
    inputs: [{ name: "_username", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "registerWriterWithSig",
    inputs: [
      { name: "_username", type: "string", internalType: "string" },
      {
        name: "_sig",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.SigParams",
        components: [
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "r", type: "bytes32", internalType: "bytes32" },
          { name: "s", type: "bytes32", internalType: "bytes32" },
          { name: "user", type: "address", internalType: "address" },
          { name: "v", type: "uint8", internalType: "uint8" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "releaseChapter",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_title", type: "string", internalType: "string" },
      { name: "_gatedURI", type: "string", internalType: "string" },
      { name: "_finale", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "releaseChapterWithSig",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_title", type: "string", internalType: "string" },
      { name: "_gatedURI", type: "string", internalType: "string" },
      { name: "_finale", type: "bool", internalType: "bool" },
      {
        name: "_sig",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.SigParams",
        components: [
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "r", type: "bytes32", internalType: "bytes32" },
          { name: "s", type: "bytes32", internalType: "bytes32" },
          { name: "user", type: "address", internalType: "address" },
          { name: "v", type: "uint8", internalType: "uint8" },
        ],
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startNewSeason",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "subscribe",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "subscribeWithSig",
    inputs: [
      {
        name: "_sig",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.SigParams",
        components: [
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "r", type: "bytes32", internalType: "bytes32" },
          { name: "s", type: "bytes32", internalType: "bytes32" },
          { name: "user", type: "address", internalType: "address" },
          { name: "v", type: "uint8", internalType: "uint8" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "useSpendBack",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "useSpendBackWithSig",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      {
        name: "_sig",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.SigParams",
        components: [
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "r", type: "bytes32", internalType: "bytes32" },
          { name: "s", type: "bytes32", internalType: "bytes32" },
          { name: "user", type: "address", internalType: "address" },
          { name: "v", type: "uint8", internalType: "uint8" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "voteEuphoriaBook",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_votes", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "voteEuphoriaBookWithSig",
    inputs: [
      { name: "_bookId", type: "uint256", internalType: "uint256" },
      { name: "_votes", type: "uint256", internalType: "uint256" },
      {
        name: "_sig",
        type: "tuple",
        internalType: "struct IEuphoriaBookFactory.SigParams",
        components: [
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "r", type: "bytes32", internalType: "bytes32" },
          { name: "s", type: "bytes32", internalType: "bytes32" },
          { name: "user", type: "address", internalType: "address" },
          { name: "v", type: "uint8", internalType: "uint8" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawBalance",
    inputs: [
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_recipient", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "BookSeasonEarningsPulled",
    inputs: [
      {
        name: "bookId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "amountToPull",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ChapterReleased",
    inputs: [
      {
        name: "bookId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "bookName",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "writer",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "chapterId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "finale",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "title",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "writtenAt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EuphoriaBookCreated",
    inputs: [
      {
        name: "bookId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "coverImage",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "name",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "writer",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "genres",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "createdAt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "completed",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "chaptersWritten",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "earnings",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SeasonFinished",
    inputs: [
      {
        name: "seasonId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "seasonAllocations",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SpendBackAllocated",
    inputs: [
      {
        name: "bookId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AlreadyRegistered", inputs: [] },
  { type: "error", name: "BelowMinimumChapterLock", inputs: [] },
  { type: "error", name: "BookAlreadyCompleted", inputs: [] },
  { type: "error", name: "InsufficientBalance", inputs: [] },
  { type: "error", name: "InsufficientSpendBacks", inputs: [] },
  { type: "error", name: "InsufficientVotes", inputs: [] },
  { type: "error", name: "InvalidBookId", inputs: [] },
  { type: "error", name: "InvalidCharacterLength", inputs: [] },
  { type: "error", name: "InvalidGenreCount", inputs: [] },
  { type: "error", name: "InvalidSelectedSeasonId", inputs: [] },
  { type: "error", name: "InvalidSignature", inputs: [] },
  { type: "error", name: "NotBookOwner", inputs: [] },
  { type: "error", name: "NotRegisteredWriter", inputs: [] },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
  },
  { type: "error", name: "SeasonOngoing", inputs: [] },
  { type: "error", name: "SignatureExpired", inputs: [] },
  { type: "error", name: "SubscriptionStillActive", inputs: [] },
  { type: "error", name: "UsernameTaken", inputs: [] },
] as const;
