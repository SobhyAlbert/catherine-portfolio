(()=>{const o=document.getElementById('intro'),v=document.getElementById('introVideo'),u=document.getElementById('unmute');let done=false;
const end=()=>{if(done)return;done=true;o.classList.add('hide');document.body.classList.remove('intro-on');try{v.pause()}catch(e){}setTimeout(()=>o.remove(),1000)};
v.addEventListener('ended',end);v.addEventListener('error',end);document.getElementById('skip').onclick=end;
u.onclick=()=>{v.muted=!v.muted;u.textContent=v.muted?'🔇 Tap to unmute':'🔊 Sound on';v.play().catch(()=>{})};
const p=v.play();if(p)p.catch(()=>{});setTimeout(()=>{if(v.readyState<2)end()},4000);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));})();
