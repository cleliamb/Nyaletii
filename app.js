const $=id=>document.getElementById(id);
const KEY='nyaleti-data-v1';
let data=JSON.parse(localStorage.getItem(KEY)||'{"checkins":[],"victories":[],"journals":[],"kit":{},"reminder":""}');
let selectedMood='';
let breathTimer=null, breathPhase='inhale', breathRemaining=120;
function save(){localStorage.setItem(KEY,JSON.stringify(data));renderStats()}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
$('todayLabel').textContent=new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long'}).format(new Date()).toUpperCase();
document.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selectedMood=b.dataset.mood}));
const affirmations=[
["Tu n'as pas besoin de tout régler aujourd'hui.","Un petit pas compte aussi."],
["Ce que tu ressens mérite d'être accueilli, pas jugé.","Tu peux prendre les choses une par une."],
["Tu peux douter et avancer quand même.","Le doute n'est pas une preuve que tu n'es pas capable."],
["Tu as le droit de demander un peu de soutien.","Tu n'as pas à tout porter toute seule."],
["Une journée compliquée ne résume pas qui tu es.","On repart de là où tu en es, c'est tout."],
["Hé, regarde le chemin déjà parcouru.","Tu peux reconnaître tes efforts, même discrets."],
["Pas besoin d'être au top pour prendre soin de toi.","On fait simple aujourd'hui."]
];
function newAff(){const a=affirmations[Math.floor(Math.random()*affirmations.length)];$('affirmation').textContent=a[0];$('affirmationNote').textContent=a[1]}
$('newAffirmation').onclick=newAff;
const routines={
'Anxieuse':{title:'On calme un peu le système',intro:'Pas besoin de faire disparaître le stress. On va juste lui faire un peu de place.',steps:['Pose les pieds au sol et regarde autour de toi.','Fais 5 respirations lentes, sans forcer.','Nomme 3 choses que tu vois et 2 sons que tu entends.','Choisis une seule petite chose à faire ensuite.']},
'Triste':{title:'On se traite avec douceur',intro:'Pas de grand programme. Juste quelques gestes pour ne pas rester seule avec tout ça.',steps:['Bois un verre d’eau et ouvre un peu les volets.','Pose une main sur ton ventre et respire naturellement.','Écris une phrase sur ce qui pèse aujourd’hui.','Si ça te ferait du bien, envoie un petit message à quelqu’un de confiance.']},
'Épuisée':{title:'Mode économie d’énergie',intro:'Aujourd’hui, on baisse la barre. Le minimum peut être largement suffisant.',steps:['Assieds-toi et prends quelques gorgées d’eau.','Étire doucement les épaules et la nuque.','Choisis une tâche minuscule, ou décide de te reposer.']},
'Agitée':{title:'On redescend tranquillement',intro:'On donne au corps une occasion de ralentir, sans le brusquer.',steps:['Relâche la mâchoire et baisse les épaules.','Marche doucement ou secoue les mains pendant 30 secondes.','Essaie 5 expirations un peu plus longues que les inspirations.','Note ce qui peut attendre à plus tard.']},
'Mitigée':{title:'Un petit point d’équilibre',intro:'On prend la température sans se mettre la pression.',steps:['Demande-toi : de quoi j’ai le plus besoin là ?','Fais deux minutes d’étirement ou de respiration.','Choisis une action réaliste pour la matinée.']},
'En forme':{title:'On cultive cette énergie',intro:'Quand ça va, on peut aussi entraîner les réflexes qui aideront les jours plus compliqués.',steps:['Note une chose qui va bien en ce moment.','Fais un mini-jeu confiance : écris une qualité que tu as utilisée récemment.','Pratique une minute de respiration calme.','Entretiens un lien : pense à appeler ou écrire à quelqu’un qui compte.']}
};
$('makeRoutine').onclick=()=>{
 if(!selectedMood){toast('Choisis ton humeur, même approximativement ♡');return}
 const r=routines[selectedMood];$('routineTitle').textContent=r.title;$('routineIntro').textContent=r.intro;
 $('routineSteps').innerHTML=r.steps.map((s,i)=>`<label class="step"><input type="checkbox"><span>${s}</span></label>`).join('');
 $('routineCard').classList.remove('hidden');data.checkins.push({date:new Date().toISOString(),mood:selectedMood,need:$('need').value});save();$('routineCard').scrollIntoView({behavior:'smooth',block:'start'});
};
$('newRoutine').onclick=()=>{$('routineCard').classList.add('hidden');$('checkin').scrollIntoView({behavior:'smooth'})};
$('finishRoutine').onclick=()=>{toast('Bien joué. Même un petit bout, ça compte. ♡');$('routineCard').classList.add('hidden')};
const prompts=['Qu’est-ce que tu as fait récemment, même si ça t’a demandé un effort ?','Quelle qualité t’a aidée cette semaine ?','Qu’est-ce que tu dirais à une amie qui aurait fait la même chose que toi ?','Quel petit défi réaliste pourrais-tu tenter aujourd’hui ?'];
$('gamePrompt').textContent=prompts[Math.floor(Math.random()*prompts.length)];
$('saveVictory').onclick=()=>{const v=$('victory').value.trim();if(!v){toast('Même une toute petite chose, ça marche.');return}data.victories.push({date:new Date().toISOString(),text:v});$('victory').value='';$('victorySaved').textContent='Gardé précieusement. Et oui, tu peux être fière de toi.';save();toast('Petite victoire gardée ♡')};
$('saveKit').onclick=()=>{data.kit={people:$('kitPeople').value,things:$('kitThings').value,words:$('kitWords').value};save();$('kitSaved').textContent='Ton kit est gardé sur cet appareil ♡';toast('Ton kit est enregistré')};
$('kitPeople').value=data.kit.people||'';$('kitThings').value=data.kit.things||'';$('kitWords').value=data.kit.words||'';
$('saveJournal').onclick=()=>{const v=$('journal').value.trim();if(!v){toast('Tu peux écrire juste quelques mots.');return}data.journals.push({date:new Date().toISOString(),text:v});$('journal').value='';$('journalSaved').textContent='Ton petit mot est enregistré sur ton téléphone.';save();toast('C’est déposé ♡')};
function renderStats(){$('checkinCount').textContent=data.checkins.length;$('victoryCount').textContent=data.victories.length;$('journalCount').textContent=data.journals.length}
renderStats();
function tickBreath(){
 const inhale=breathPhase==='inhale';$('breathText').textContent=inhale?'Inspire':'Expire';$('breathCircle').className='breath-circle '+(inhale?'inhale':'exhale');
 let n=inhale?4:6;let elapsed=0;
 breathTimer=setInterval(()=>{elapsed++;breathRemaining--;if(breathRemaining<=0){stopBreath();$('breathText').textContent='Bravo ♡';$('breathCount').textContent='Tu peux reprendre ton rythme naturel.';return}
 if(elapsed>=n){clearInterval(breathTimer);breathPhase=inhale?'exhale':'inhale';tickBreath()}
 $('breathCount').textContent='Encore '+Math.ceil(breathRemaining/60)+' min environ';},1000);
}
function stopBreath(){if(breathTimer)clearInterval(breathTimer);breathTimer=null;$('breathCircle').className='breath-circle';$('breathText').textContent='Prête ?';$('breathCount').textContent='Un petit exercice de 2 minutes';breathRemaining=120;breathPhase='inhale'}
$('startBreath').onclick=()=>{stopBreath();tickBreath()};$('stopBreath').onclick=stopBreath;
$('reminderTime').value=data.reminder||'15:00';
$('saveReminder').onclick=()=>{data.reminder=$('reminderTime').value;save();$('reminderSaved').textContent='C’est noté. Pour un rappel fiable téléphone verrouillé, ajoute aussi une alarme ou un rappel Android à cette heure.';toast('Ton horaire est enregistré')};
$('exportData').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nyaleti-sauvegarde.json';a.click();URL.revokeObjectURL(a.href)};
$('importData').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const imported=JSON.parse(await f.text());if(!imported||!Array.isArray(imported.checkins))throw Error();data=imported;save();location.reload()}catch{toast('Ce fichier ne ressemble pas à une sauvegarde Nyaleti.')}};
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
