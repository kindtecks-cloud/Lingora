/* Lingora Supabase authentication bootstrap. The publishable key is intended for browser use; never put a service-role key here. */
const LINGORA_SUPABASE_URL='https://usgskxpkkjeirrdbesku.supabase.co';
const LINGORA_SUPABASE_PUBLISHABLE_KEY='sb_publishable_0Tl1dLl9gS_hJODfXU4A3A_acN6efcq';

(function(){
  const s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  s.onload=()=>boot();
  document.head.appendChild(s);

  function boot(){
    const client=supabase.createClient(LINGORA_SUPABASE_URL,LINGORA_SUPABASE_PUBLISHABLE_KEY);
    window.lingoraSupabase=client;
    const buttons=document.querySelectorAll('.actions .btn');
    if(buttons.length>=2){
      buttons[0].onclick=()=>openAuth('login');
      buttons[1].onclick=()=>openAuth('signup');
    }
    client.auth.getSession().then(({data})=>updateHeader(data.session));
    client.auth.onAuthStateChange((_event,session)=>updateHeader(session));
    window.lingoraAuth={client,openAuth};
  }

  function updateHeader(session){
    const box=document.querySelector('.actions'); if(!box)return;
    if(session){
      const email=session.user.email||'Account';
      box.innerHTML=`<span style="align-self:center;font-size:13px;color:#687386">${escapeHtml(email)}</span><button class="btn light" id="logoutBtn">Log out</button>`;
      document.getElementById('logoutBtn').onclick=()=>window.lingoraSupabase.auth.signOut();
    }
  }

  function openAuth(mode){
    let m=document.getElementById('authModal');
    if(!m){
      m=document.createElement('div');m.id='authModal';m.className='modal';
      m.innerHTML=`<div class="box"><button class="close" id="authClose">×</button><h2 id="authTitle">Create your Lingora account</h2><p class="muted" id="authIntro">Join as a student and start learning.</p><div id="authForm"><input id="authName" class="field2" placeholder="Your name"><input id="authEmail" class="field2" type="email" placeholder="Email"><input id="authPassword" class="field2" type="password" placeholder="Password (6+ characters)"><select id="authRole" class="field2"><option value="student">I want to learn</option><option value="tutor">I want to teach</option></select><button class="btn primary" id="authSubmit" style="width:100%;margin-top:8px">Create account</button><button class="btn light" id="authSwitch" style="width:100%;margin-top:8px">I already have an account</button><p id="authMsg" class="muted" style="font-size:13px"></p></div></div>`;
      document.body.appendChild(m);document.getElementById('authClose').onclick=()=>m.classList.remove('show');
      document.getElementById('authSwitch').onclick=()=>openAuth(mode==='signup'?'login':'signup');
    }
    const signup=mode==='signup';
    document.getElementById('authTitle').textContent=signup?'Create your Lingora account':'Welcome back';
    document.getElementById('authIntro').textContent=signup?'Join as a student or tutor.':'Log in to your Lingora account.';
    document.getElementById('authName').style.display=signup?'block':'none';
    document.getElementById('authRole').style.display=signup?'block':'none';
    document.getElementById('authSubmit').textContent=signup?'Create account':'Log in';
    document.getElementById('authSwitch').textContent=signup?'I already have an account':'Create a new account';
    document.getElementById('authMsg').textContent='';
    document.getElementById('authSubmit').onclick=async()=>{
      const email=document.getElementById('authEmail').value.trim();const password=document.getElementById('authPassword').value;const msg=document.getElementById('authMsg');
      if(!email||!password){msg.textContent='Please enter your email and password.';return}
      msg.textContent='Working…';
      const c=window.lingoraSupabase;
      if(signup){
        const name=document.getElementById('authName').value.trim();const role=document.getElementById('authRole').value;
        const {data,error}=await c.auth.signUp({email,password});
        if(error){msg.textContent=error.message;return}
        if(data.user){
          const {error:pe}=await c.from('profiles').insert({id:data.user.id,role,full_name:name||email.split('@')[0],email});
          if(pe){msg.textContent='Account created, but profile setup needs one more database permission. '+pe.message;return}
        }
        msg.textContent='Account created. Check your email if confirmation is enabled.';
      }else{
        const {error}=await c.auth.signInWithPassword({email,password});
        msg.textContent=error?error.message:'Logged in successfully.';
        if(!error)setTimeout(()=>m.classList.remove('show'),700);
      }
    };
    m.classList.add('show');
  }
  function escapeHtml(v){return v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
})();
