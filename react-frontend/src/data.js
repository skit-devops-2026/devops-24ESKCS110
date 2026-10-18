export const seedData = {
 notes:[
  {id:'n1',title:'React Hooks in Practice',category:'Web Development',content:'Hooks let functional components use state, effects, and other React features without a class.',tags:['React','JavaScript','Frontend'],updated:'Today'},
  {id:'n2',title:'JWT Authentication Flow',category:'Backend',content:'JSON Web Tokens securely carry claims between a client and server when their lifecycle is managed carefully.',tags:['JWT','Authentication','Node.js'],updated:'Yesterday'},
  {id:'n3',title:'MongoDB Indexing Notes',category:'Database',content:'Indexes speed up common queries by helping MongoDB locate documents without scanning the entire collection.',tags:['MongoDB','Database','Performance'],updated:'2 days ago'},
  {id:'n4',title:'Docker Image Fundamentals',category:'DevOps',content:'Docker packages an application and its dependencies into portable, lightweight images that run consistently.',tags:['Docker','DevOps','Containers'],updated:'3 days ago'},
  {id:'n5',title:'Binary Search Patterns',category:'Programming',content:'Binary search repeatedly halves a sorted search space, turning a linear lookup into a logarithmic one.',tags:['Algorithms','C++','DSA'],updated:'5 days ago'},
  {id:'n6',title:'Readable Commit Messages',category:'General',content:'A concise commit subject followed by useful context makes project history easier to scan and maintain.',tags:['Git','Workflow','Best Practices'],updated:'1 week ago'}],
 snippets:[
  {id:'s1',title:'Fetch API with async/await',language:'JavaScript',description:'A clean pattern for requesting JSON data and handling errors.',code:'async function getData(url) {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}',tags:['fetch','async','api']},
  {id:'s2',title:'Python list comprehension',language:'Python',description:'Transform and filter a collection in one readable expression.',code:'squares = [n * n for n in numbers if n > 0]',tags:['python','lists']},
  {id:'s3',title:'Docker Compose quick start',language:'YAML',description:'Minimal service definition for a local web application.',code:'services:\n  app:\n    build: .\n    ports:\n      - "3000:3000"',tags:['docker','devops']}],
 resources:[
  {id:'r1',title:'React Documentation',type:'Documentation',url:'https://react.dev',description:'Official guide to building user interfaces with React.',tags:['React','Frontend']},
  {id:'r2',title:'MDN Web Docs',type:'Documentation',url:'https://developer.mozilla.org',description:'Reference material for HTML, CSS, JavaScript and web APIs.',tags:['Web','JavaScript']},
  {id:'r3',title:'Docker Get Started',type:'Tutorial',url:'https://docs.docker.com/get-started/',description:'Learn the basics of containerizing an application.',tags:['Docker','DevOps']},
  {id:'r4',title:'Git Book',type:'Book',url:'https://git-scm.com/book/en/v2',description:'A comprehensive introduction to Git version control.',tags:['Git','Tools']}],
 bugs:[
  {id:'b1',title:'Login redirects to the wrong page',description:'After signing in, the user sometimes lands on the landing page instead of the dashboard.',severity:'High',status:'Open',tags:['Authentication','Navigation'],created:'Today'},
  {id:'b2',title:'Search returns empty results',description:'Search results are not updated after changing the category filter.',severity:'Medium',status:'In Progress',tags:['Search','Filtering'],created:'Yesterday'},
  {id:'b3',title:'Mobile sidebar covers content',description:'The sidebar overlay does not close when a navigation link is selected.',severity:'Low',status:'Resolved',tags:['Responsive','UI'],created:'2 days ago'}],
 projects:[{id:'p1',title:'DevVault',description:'Developer knowledge management platform and personal second brain.',status:'In Progress',stack:['React','JavaScript','Tailwind CSS']},{id:'p2',title:'SkyGuard AI',description:'AI-powered monitoring and incident insights dashboard.',status:'Planning',stack:['Python','FastAPI','Angular'] }]
};
export function loadData(key){try{const value=localStorage.getItem('devvault_'+key);return value?JSON.parse(value):seedData[key]||[]}catch{return seedData[key]||[]}}
export function saveData(key,value){localStorage.setItem('devvault_'+key,JSON.stringify(value))}
