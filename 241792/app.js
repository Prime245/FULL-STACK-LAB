// Everything is simulated in this browser: no backend or API calls.
const $ = id => document.getElementById(id);
const page = location.pathname.split('/').pop();
const members = [
  {id:'affan', name:'Affan Tarar', minutes:2, bio:'Code, coffee & good company.'},
  {id:'sara', name:'Sara Ahmed', minutes:8, bio:'Collecting little moments.'},
  {id:'hamza', name:'Hamza Khan', minutes:21, bio:'Always up for an adventure.'},
  {id:'zoya', name:'Zoya Malik', minutes:35, bio:'Making room for new ideas.'},
  {id:'ali', name:'Ali Raza', minutes:48, bio:'Learning something every day.', ignores:['asad']}
];
const me = {id:'asad', name:'Asad Hayat', minutes:0};
const initial = {friends:['affan','sara','hamza'], requests:[], ratings:{}, chats:{}, posts:[
  {id:1, author:'affan', text:'Finished my first web project today! Small steps, late nights, and a lot of learning. What are you building this week?', likes:12, dislikes:0, vote:'', to:'all'},
  {id:2, author:'sara', text:'A little reminder to step outside. Islamabad sunsets make even the busiest days feel a little softer. ☀', likes:24, dislikes:1, vote:'', to:'all'},
  {id:3, author:'hamza', text:'Weekend plan: a walk on Trail 3 and breakfast with friends. Who is joining? 🌿', likes:8, dislikes:0, vote:'', to:'all'}
]};
let state = initial;
try { state = JSON.parse(localStorage.getItem('connecfriend')) || initial; }
catch { localStorage.removeItem('connecfriend'); }
const person = id => id === 'asad' ? me : members.find(p => p.id === id);
const friends = () => members.filter(p => state.friends.includes(p.id)).sort((a,b) => a.minutes-b.minutes);
// Escape typed text before displaying it as HTML.
const safe = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const avatar = p => `<img src="assets/${p.id}.svg" width="44" height="44" class="rounded-circle flex-shrink-0" alt="${p.name}'s profile picture">`;
function save() { localStorage.setItem('connecfriend', JSON.stringify(state)); }
function notify(text) { $('notice').innerHTML = `<div class="alert alert-primary rounded-4 d-flex align-items-center justify-content-between gap-3"><span>${safe(text)}</span><button class="btn-close flex-shrink-0" aria-label="Dismiss notification" onclick="this.parentElement.remove()"></button></div>`; }
function login(event) {
  event.preventDefault();
  if ($('username').value.trim() !== 'asad' || $('password').value !== '1234') {
    $('loginError').textContent = 'Incorrect login. Use asad and 1234 for this demo.'; return;
  }
  sessionStorage.setItem('connecLogin','yes'); location.href = 'home.html';
}
function logout() { sessionStorage.removeItem('connecLogin'); location.href = 'index.html'; }
if (page === 'home.html' || page === 'profile.html') {
  if (!sessionStorage.getItem('connecLogin')) location.replace('index.html');
  else if (page === 'home.html') renderHome();
  else renderProfile();
}
function renderHome() {
  $('friendCount').textContent = ` / ${friends().length}`;
  $('circle').innerHTML = friends().map(p => `<div class="d-flex gap-3 align-items-center py-2">${avatar(p)}<div><b>${p.name}</b><div class="small text-body-secondary">Logged in ${p.minutes} min ago</div></div></div>`).join('');
  $('recipients').innerHTML = friends().map(p => `<label class="me-3 small"><input class="form-check-input me-1" type="checkbox" name="recipient" value="${p.id}">${p.name}</label>`).join('');
  $('person').innerHTML = members.map(p => `<option value="${p.id}">${p.name}${state.friends.includes(p.id)?' · Friend':' · Member'}</option>`).join('');
  renderDiscover(); renderFeed(); renderChat();
}
function renderDiscover() {
  $('discover').innerHTML = members.filter(p => !state.friends.includes(p.id)).map(p => `<div class="border-top pt-3 mt-3"><div class="d-flex gap-2 align-items-center mb-2">${avatar(p)}<b>${p.name}</b></div><button class="btn btn-sm btn-outline-primary rounded-pill" onclick="invite('${p.id}')" ${state.requests.includes(p.id)?'disabled':''}>${state.requests.includes(p.id)?'Invitation pending':'Invite to circle +'}</button></div>`).join('');
}
function invite(id) {
  if (person(id).ignores?.includes('asad')) { notify('Request not sent: this member has added you to their ignore list.'); return; }
  if (state.requests.includes(id)) return;
  state.requests.push(id); save(); renderDiscover(); notify('Friend invitation sent. Waiting for the member to accept.');
}
function renderFeed() {
  const query = $('feedSearch').value.trim().toLowerCase();
  $('feed').innerHTML = state.posts.filter(post => (person(post.author).name + ' ' + post.text).toLowerCase().includes(query)).map(post => {
    const p = person(post.author);
    const audience = post.to === 'all' ? 'All friends' : post.to.map(id => person(id).name).join(', ');
    return `<article class="card border-0 rounded-4 shadow-sm p-4 mb-3"><div class="d-flex align-items-center gap-3">${avatar(p)}<div><h3 class="h6 mb-1">${p.name}</h3><span class="small text-body-secondary">${p.minutes ? `Last login ${p.minutes} min ago` : 'Logged in just now'}</span></div></div><p class="fs-5 my-4 text-break">${safe(post.text).replace(/\n/g,'<br>')}</p><div class="small text-body-secondary mb-3">Shared with: ${safe(audience)}</div><div class="border-top pt-3 d-flex gap-2"><button aria-pressed="${post.vote==='likes'}" class="btn btn-sm ${post.vote==='likes'?'btn-primary':'btn-outline-secondary'} rounded-pill px-3" onclick="vote(${post.id},'likes')">♡ Like · ${post.likes}</button><button aria-pressed="${post.vote==='dislikes'}" class="btn btn-sm ${post.vote==='dislikes'?'btn-danger':'btn-outline-secondary'} rounded-pill px-3" onclick="vote(${post.id},'dislikes')">− Dislike · ${post.dislikes}</button></div></article>`;
  }).join('') || '<div class="bg-body border rounded-4 p-5 text-center"><div class="fs-2 text-primary" aria-hidden="true">⌕</div><h3 class="h5 mt-2">No updates found</h3><p class="text-body-secondary mb-0">Try another name or keyword, or clear your search.</p></div>';
}
function publish(event) {
  event.preventDefault();
  const text = $('news').value.trim();
  const selected = [...document.querySelectorAll('[name=recipient]:checked')].map(input => input.value);
  if (!text) { notify('Write something before sharing.'); return; }
  if ($('audience').value === 'some' && !selected.length) { notify('Choose at least one friend.'); return; }
  state.posts.unshift({id:Date.now(), author:'asad', text, likes:0, dislikes:0, vote:'', to:$('audience').value==='all'?'all':selected});
  save(); $('feedSearch').value = ''; renderFeed(); $('news').value = ''; $('newsCount').textContent = '0 / 500'; notify('Your update has been shared with your chosen audience.');
}
function vote(id, type) {
  const post = state.posts.find(p => p.id === id);
  const previous = post.vote;
  if (previous) post[previous]--;
  post.vote = previous === type ? '' : type;
  if (post.vote) post[type]++;
  save(); renderFeed();
}
function renderProfile() {
  $('friends').innerHTML = friends().map(p => `<div class="col-md-6"><article class="bg-body rounded-4 p-4 shadow-sm h-100"><div class="d-flex gap-3 align-items-center mb-3">${avatar(p)}<div><h3 class="h6 mb-1">${p.name}</h3><small class="text-body-secondary">Logged in ${p.minutes} min ago</small></div></div><p class="text-body-secondary">${p.bio}</p><label class="small text-primary fw-bold" for="rating-${p.id}">YOUR FRIEND RATING</label><select id="rating-${p.id}" class="form-select mt-2" onchange="rate('${p.id}',this.value)"><option value="">Choose a rating</option>${['🤪 Stupid','😎 Cool','🛡 Trustworthy'].map((label,i) => `<option value="${i+1}" ${Number(state.ratings[p.id])===i+1?'selected':''}>${i+1} · ${label}</option>`).join('')}</select></article></div>`).join('');
}
function rate(id, value) { state.ratings[id] = value; save(); notify('Friend rating updated.'); }
function renderChat() {
  const messages = state.chats[$('person').value] || [];
  $('chat').innerHTML = messages.length ? messages.map(m => `<div class="bg-primary-subtle rounded-3 p-3 mb-2 text-break"><b>You</b><small class="float-end text-body-secondary">${safe(m.time)}</small><p class="mb-0 mt-1">${safe(m.text)}</p></div>`).join('') : '<div class="bg-body-tertiary rounded-3 p-3 text-body-secondary">No messages yet. Start the conversation.</div>';
}
function sendMessage(event) {
  event.preventDefault();
  const text = $('message').value.trim();
  if (!text) { notify('Please enter a message.'); return; }
  const id = $('person').value;
  state.chats[id] ||= [];
  state.chats[id].push({text, time:new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})});
  save(); renderChat(); $('message').value = ''; notify('Message sent in this local demo.');
}

// A small carousel using Bootstrap's existing slide classes; no extra library.
const slides = document.querySelectorAll('#highlights .carousel-item');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let slideIndex = 0, slidesPaused = reducedMotion.matches;
function moveSlide(direction) {
  slides[slideIndex].classList.remove('active');
  slideIndex = (slideIndex + direction + slides.length) % slides.length;
  slides[slideIndex].classList.add('active');
  if (!reducedMotion.matches) slides[slideIndex].animate([{opacity:0, transform:`translateX(${direction * 35}px)`}, {opacity:1, transform:'translateX(0)'}], {duration:400, easing:'ease-out'});
  $('slideCount').textContent = `0${slideIndex + 1} / 03`;
}
function pauseSlides() {
  slidesPaused = !slidesPaused;
  $('slidePause').textContent = slidesPaused ? 'Play slides' : 'Pause slides';
  $('slidePause').setAttribute('aria-pressed', slidesPaused);
}
if (slides.length) {
  if (slidesPaused) { slidesPaused = false; pauseSlides(); }
  setInterval(() => {
    if (!slidesPaused && !reducedMotion.matches && !document.hidden && !$('highlights').matches(':hover, :focus-within')) moveSlide(1);
  }, 6000);
}
