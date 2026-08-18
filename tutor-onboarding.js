/* Tutor onboarding for Lingora. Requires supabase-auth.js on the page. */
(function(){
 function esc(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 function init(){
  if(!window.lingoraSupabase)return setTimeout(init,250);
  const actions=document.querySelector('.actions'); if(!actions)return;
  const b=document.createElement('button'); b.className='btn light'; b.textContent='Become a tutor'; b.onclick=open; actions.appendChild(b);
 }
 async function open(){
  const c=window.lingoraSupabase; const {data:{session}}=await c.auth.getSession();
  if(!session){document.querySelector('.actions .btn.primary')?.click();return}
  const {data:p}=await c.from('profiles').select('*').eq('id',session.user.id).maybeSingle();
  const m=document.getElementById('modal'); const box=document.getElementById('modalContent');
  box.innerHTML=`<h2>Become a Lingora tutor</h2><p class="muted">Create your tutor profile and choose a lesson price between €4 and €10.</p>
  <input id="tBio" class="field2" placeholder="Short introduction" value="${esc(p?.bio||'')}">
  <input id="tLanguages" class="field2" placeholder="Languages, e.g. English, French" value="${esc(p?.languages?.join(', ')||'')}">
  <input id="tLevels" class="field2" placeholder="Levels, e.g. A2, B1, B2" value="${esc(p?.levels?.join(', ')||'')}">
  <input id="tGoals" class="field2" placeholder="Specialties, e.g. Business, Conversation" value="${esc(p?.goals?.join(', ')||'')}">
  <input id="tPrice" class="field2" type="number" min="4" max="10" step="1" placeholder="Price in €" value="${p?.price_eur||5}">
  <input id="tExperience" class="field2" type="number" min="0" max="60" placeholder="Years of experience" value="${p?.experience_years||0}">
  <button id="saveTutor" class="btn primary" style="width:100%;margin-top:10px">Save tutor profile</button><p id="tMsg" class="muted" style="font-size:13px"></p>`;
  m.classList.add('show'); document.getElementById('saveTutor').onclick=save;
 }
 async function save(){
  const c=window.lingoraSupabase; const {data:{session}}=await c.auth.getSession(); const msg=document.getElementById('tMsg');
  const price=Number(document.getElementById('tPrice').value); if(price<4||price>10){msg.textContent='Price must be between €4 and €10.';return}
  msg.textContent='Saving…';
  const split=id=>document.getElementById(id).value.split(',').map(x=>x.trim()).filter(Boolean);
  const payload={id:session.user.id,bio:document.getElementById('tBio').value.trim(),languages:split('tLanguages'),levels:split('tLevels'),goals:split('tGoals'),price_eur:price,experience_years:Number(document.getElementById('tExperience').value)||0,approved:false};
  const {error}=await c.from('tutors').upsert(payload);
  msg.textContent=error?'Could not save yet: '+error.message:'Tutor profile saved. It will appear after approval.';
 }
 init();
})();
