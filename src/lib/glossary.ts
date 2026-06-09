// Short, plain descriptions for facet values, shown as tooltips so the meaning
// of a tag (infosec, academic, formal-methods, ...) is discoverable in the UI.
// Keys are the exact lowercase values used in the YAML.

const DESCRIPTIONS: Record<string, string> = {
  // kind
  academic:
    'Peer-reviewed research conference, run by academia or a scholarly society.',
  industry:
    'Vendor- and practitioner-driven event focused on products and networking.',
  business: 'Business- and decision-maker-oriented event, often with an expo.',
  community: 'Community-run, often volunteer-organized and low-cost.',

  // status
  confirmed: 'You plan to attend; travel is decided.',
  tentative: 'Considering attending; not yet decided.',
  interested: 'On the radar to evaluate later.',

  // security fields
  infosec: 'Information security research and practice.',
  offensive: 'Offensive security: exploitation, red teaming, attack research.',
  hacking: 'Hacker-community topics, hands-on exploitation, CTFs.',

  // cryptography / theory
  crypto: 'Cryptography: design and analysis of primitives and protocols.',
  theory: 'Theoretical foundations and proofs.',

  // open source / blockchain
  'open-source': 'Free and open-source software development.',
  blockchain: 'Blockchain and decentralized systems.',
  ethereum: 'Ethereum ecosystem and protocol development.',

  // formal methods / PL
  'formal-methods':
    'Mathematical techniques for specifying and verifying systems.',
  verification: 'Proving that a system meets a formal specification.',
  logic: 'Mathematical logic applied to computer science.',
  'theorem-proving': 'Machine-checked proofs and interactive proof assistants.',
  'programming-languages':
    'Design, semantics, and implementation of programming languages.',
  'type-systems': 'Type theory and type systems for programming languages.',
  'static-analysis':
    'Analyzing programs without running them to find bugs or prove properties.',
  concurrency: 'Concurrent and distributed system models and reasoning.',
  'software-engineering':
    'Methods and tools for building and maintaining software.',

  // AI / ML
  ai: 'Artificial intelligence, broadly.',
  'machine-learning': 'Learning models from data.',
  'reinforcement-learning': 'Learning by interaction and reward.',
  statistics: 'Statistical methods and learning theory.',
  'data-mining': 'Discovering patterns in large datasets.',
  robotics: 'Robot learning and control.',
  nlp: 'Natural language processing.',
  'computer-vision': 'Image and video understanding.',
  speech: 'Speech recognition and processing.',
  graphics: 'Computer graphics and interactive techniques.',
};

export function describe(value: string): string | undefined {
  return DESCRIPTIONS[value.toLowerCase()];
}
