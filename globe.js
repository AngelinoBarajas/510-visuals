/* ============================================
   510 VISUALS — Globe Three.js Component
   Target: .globe_canvas-wrapper, .globe_cms-item
   Dependencies: Three.js r128 (loaded below)
   Safe to remove: Yes — delete this + globe.css + preview HTML
   Changed: 2026-04-02 — Initial build
   ============================================ */

// Inject Three.js
(function(){
  if(window.THREE) return initGlobe();
  var s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload=initGlobe;
  document.head.appendChild(s);
})();

function initGlobe(){
window.Webflow||=[];window.Webflow.push(function(){
if(window.__tenGlobeInit) return; window.__tenGlobeInit=true;

var wrapper=document.querySelector('.globe_canvas-wrapper');
if(!wrapper) return;

// Inject preview card HTML into body
var pvHTML='<div id="globe-preview"><img class="gp-img" src="" alt=""><div class="gp-body"><div class="gp-loc"></div><div class="gp-title"></div><a class="gp-cta" href="#">View Project<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5h8M6 2l3 3-3 3"/></svg></a></div></div>';
if(!document.getElementById('globe-preview')){
  var d=document.createElement('div');d.innerHTML=pvHTML;
  document.body.appendChild(d.firstChild);
}

var canvas=document.createElement('canvas');
wrapper.appendChild(canvas);

// Decode base64 continent dots (binary int16 pairs)
function decodeDots(b64){
  var bin=atob(b64);
  var buf=new ArrayBuffer(bin.length);
  var raw=new Uint8Array(buf);
  for(var i=0;i<bin.length;i++) raw[i]=bin.charCodeAt(i);
  var view=new DataView(buf);var dots=[];
  for(var i=0;i<buf.byteLength;i+=4) dots.push([view.getInt16(i,true)/100,view.getInt16(i+2,true)/100]);
  return Promise.resolve(dots);
}

var DOTS_B64="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";

// Read CMS data
function readCMS(){
  var items=document.querySelectorAll('.globe_cms-item');
  var projects=[];
  items.forEach(function(el){
    var lat=parseFloat(el.getAttribute('data-globe-lat'));
    var lng=parseFloat(el.getAttribute('data-globe-lng'));
    if(isNaN(lat)||isNaN(lng)) return;
    var imgEl=el.querySelector('.globe_cms-img');
    projects.push({
      city:el.getAttribute('data-globe-city')||'',
      region:'',lat:lat,lng:lng,
      title:el.getAttribute('data-globe-title')||'',
      img:imgEl?imgEl.getAttribute('src'):'',
      slug:'/projects/'+(el.getAttribute('data-globe-slug')||'')
    });
  });
  return projects;
}

decodeDots(DOTS_B64).then(function(LAND_DOTS){
  var CMS_PROJECTS=readCMS();
  var PAL={light:0xb8c9cc,mid:0x37535a,dark:0x1c2227,accent:0x5a8a94,glow:0x4a7580,bright:0xd0e0e3};
  var BROOKLYN={city:"Brooklyn",region:"NY",lat:40.6782,lng:-73.9442,type:"HQ"};
  var SHENZHEN={city:"Shenzhen",region:"China",lat:22.5431,lng:114.0579,type:"hero"};

  var W=wrapper.clientWidth,H=wrapper.clientHeight;
  var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(W,H);
  renderer.setClearColor(0x000000,0);

  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(45,W/H,0.1,1000);
  camera.position.set(0,0.4,2.2);

  scene.add(new THREE.AmbientLight(PAL.mid,0.4));
  var fl=new THREE.DirectionalLight(PAL.light,0.5);fl.position.set(2,2,3);scene.add(fl);
  var bl=new THREE.DirectionalLight(PAL.mid,0.3);bl.position.set(-3,-1,-2);scene.add(bl);
  var rl=new THREE.PointLight(PAL.accent,0.6,10);rl.position.set(-3,1,1);scene.add(rl);

  var globeGroup=new THREE.Group();
  scene.add(globeGroup);
  var R=1;

  // Atmosphere
  globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.12,64,64),new THREE.ShaderMaterial({
    vertexShader:'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec3 vN;void main(){float d=dot(vN,vec3(0,0,1));float i=pow(0.5-d,4.0)*0.3;if(i<0.01)discard;gl_FragColor=vec4(0.345,0.525,0.58,i);}',
    blending:THREE.AdditiveBlending,side:THREE.BackSide,transparent:true,depthWrite:false
  })));

  // Dark core
  globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R*0.994,64,64),new THREE.MeshPhongMaterial({color:0x151b1f,transparent:true,opacity:0.95,shininess:3})));

  function ll2v(lat,lng,r){var phi=(90-lat)*Math.PI/180,theta=(lng+180)*Math.PI/180;return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta))}

  // Continent dots
  var dP=new Float32Array(LAND_DOTS.length*3),dC=new Float32Array(LAND_DOTS.length*3);
  var cA=new THREE.Color(PAL.mid),cB=new THREE.Color(PAL.light),cX=new THREE.Color(PAL.accent);
  LAND_DOTS.forEach(function(d,i){var v=ll2v(d[0],d[1],R);dP[i*3]=v.x;dP[i*3+1]=v.y;dP[i*3+2]=v.z;var rn=Math.random(),c=rn>0.85?cB:rn>0.6?cX:cA;dC[i*3]=c.r;dC[i*3+1]=c.g;dC[i*3+2]=c.b});
  var dG=new THREE.BufferGeometry();dG.setAttribute('position',new THREE.BufferAttribute(dP,3));dG.setAttribute('color',new THREE.BufferAttribute(dC,3));
  globeGroup.add(new THREE.Points(dG,new THREE.PointsMaterial({size:0.011,vertexColors:true,transparent:true,opacity:0.85,sizeAttenuation:true})));

  // Graticule
  var gMat=new THREE.LineBasicMaterial({color:PAL.mid,transparent:true,opacity:0.18});
  for(var lat=-60;lat<=60;lat+=30){var p=[];for(var lng=-180;lng<=180;lng+=4)p.push(ll2v(lat,lng,R*1.001));globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p),gMat))}
  for(var lng2=-180;lng2<180;lng2+=30){var p2=[];for(var lat2=-90;lat2<=90;lat2+=4)p2.push(ll2v(lat2,lng2,R*1.001));globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p2),gMat))}

  // Pins
  var pinGroup=new THREE.Group(),pinMeshes=[],pulseRings=[];
  function createPin(loc,idx){
    var pos=ll2v(loc.lat,loc.lng,R*1.004);
    var isHQ=loc.type==='HQ',isHero=loc.type==='hero';
    var coreR=isHQ?0.009:isHero?0.008:0.005;
    var core=new THREE.Mesh(new THREE.CircleGeometry(coreR,24),new THREE.MeshBasicMaterial({color:isHQ?0xd0e0e3:isHero?0xb8c9cc:0x7a9fa6,side:THREE.DoubleSide}));
    core.position.copy(pos);core.lookAt(pos.clone().multiplyScalar(2));pinGroup.add(core);
    var hitbox=new THREE.Mesh(new THREE.SphereGeometry(isHQ?0.04:isHero?0.035:0.03,12,12),new THREE.MeshBasicMaterial({visible:false}));
    hitbox.position.copy(pos);hitbox.userData=Object.assign({},loc,{_idx:idx});pinGroup.add(hitbox);pinMeshes.push(hitbox);
    var ri=coreR+0.003,ro=ri+(isHQ?0.0025:0.0015);
    var ring=new THREE.Mesh(new THREE.RingGeometry(ri,ro,32),new THREE.MeshBasicMaterial({color:isHQ?0xd0e0e3:isHero?0x8aacb2:0x5a8a94,transparent:true,opacity:isHQ?0.5:0.3,side:THREE.DoubleSide}));
    ring.position.copy(pos);ring.lookAt(pos.clone().multiplyScalar(2));pinGroup.add(ring);
    if(isHQ||isHero){var po=ro+0.004,pi2=po+0.002;var pulse=new THREE.Mesh(new THREE.RingGeometry(po,pi2,32),new THREE.MeshBasicMaterial({color:isHQ?0xd0e0e3:0x8aacb2,transparent:true,opacity:0.2,side:THREE.DoubleSide}));pulse.position.copy(pos);pulse.lookAt(pos.clone().multiplyScalar(2));pulse.userData={isPulse:true};pinGroup.add(pulse);pulseRings.push(pulse)}
  }
  createPin(BROOKLYN,-1);createPin(SHENZHEN,-2);
  CMS_PROJECTS.forEach(function(p,i){createPin(p,i)});
  globeGroup.add(pinGroup);

  // Arcs
  var arcGroup=new THREE.Group(),arcs=[];
  function makeArc(start,end,hero){
    var sv=ll2v(start.lat,start.lng,R*1.008),ev=ll2v(end.lat,end.lng,R*1.008);
    var dist=sv.distanceTo(ev);var mid=new THREE.Vector3().addVectors(sv,ev).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(R+dist*(hero?0.4:0.28));
    var curve=new THREE.QuadraticBezierCurve3(sv,mid,ev);var nPts=hero?120:80;var pts=curve.getPoints(nPts);
    var geom=new THREE.BufferGeometry().setFromPoints(pts);geom.setDrawRange(0,0);
    var glowGeom=new THREE.BufferGeometry().setFromPoints(pts);glowGeom.setDrawRange(0,0);
    var glowLine=new THREE.Line(glowGeom,new THREE.LineBasicMaterial({color:hero?0xd0e0e3:PAL.accent,transparent:true,opacity:hero?0.15:0.08}));arcGroup.add(glowLine);
    var line=new THREE.Line(geom,new THREE.LineBasicMaterial({color:hero?PAL.bright:PAL.light,transparent:true,opacity:hero?0.5:0.3}));arcGroup.add(line);
    var td=new THREE.Mesh(new THREE.SphereGeometry(hero?0.006:0.004,10,10),new THREE.MeshBasicMaterial({color:0xd0e0e3,transparent:true,opacity:0}));arcGroup.add(td);
    var tdGlow=new THREE.Mesh(new THREE.SphereGeometry(hero?0.018:0.012,10,10),new THREE.MeshBasicMaterial({color:PAL.accent,transparent:true,opacity:0}));arcGroup.add(tdGlow);
    return{line:line,geom:geom,glowLine:glowLine,glowGeom:glowGeom,curve:curve,td:td,tdGlow:tdGlow,nPts:nPts,hero:hero,progress:Math.random()*2.2,speed:hero?0.0015:(0.002+Math.random()*0.003)};
  }
  arcs.push(makeArc(BROOKLYN,SHENZHEN,true));
  CMS_PROJECTS.forEach(function(p){arcs.push(makeArc(BROOKLYN,p,false))});
  globeGroup.add(arcGroup);

  // Preview
  var preview=document.getElementById('globe-preview');
  var pvImg=preview.querySelector('.gp-img'),pvLoc=preview.querySelector('.gp-loc'),pvTitle=preview.querySelector('.gp-title'),pvCta=preview.querySelector('.gp-cta');
  var hoveredProj=null,hoveringPin=false,mouseOnCard=false,dismissTimer=null;

  function showPreview(proj,sx,sy){
    if(!proj.title)return;
    pvImg.src=proj.img||'';pvImg.style.display=proj.img?'block':'none';
    pvLoc.textContent=proj.city+(proj.region?', '+proj.region:'');
    pvTitle.textContent=proj.title;pvCta.href=proj.slug||'#';
    var l=sx+20,t=sy-80;if(l+260>innerWidth)l=sx-260;if(t<10)t=10;if(t+280>innerHeight)t=innerHeight-290;
    preview.style.left=l+'px';preview.style.top=t+'px';
    preview.classList.add('is-visible');hoveredProj=proj;
  }
  function hidePreview(){preview.classList.remove('is-visible');hoveredProj=null;hoveringPin=false}
  function startDismiss(){cancelDismiss();dismissTimer=setTimeout(function(){dismissTimer=null;hoveringPin=false;hidePreview()},600)}
  function cancelDismiss(){if(dismissTimer){clearTimeout(dismissTimer);dismissTimer=null}}
  function dismissPreview(){cancelDismiss();hoveringPin=false;hidePreview()}

  // Mouse
  var mouse={x:0,y:0},ray=new THREE.Raycaster();
  var dragging=false,dragX=0,dragY=0,velX=0,velY=0;

  canvas.addEventListener('mousemove',function(e){
    var rect=canvas.getBoundingClientRect();
    mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
    if(dragging){velY=(e.clientX-dragX)*0.0008;velX=(e.clientY-dragY)*0.0008;dragX=e.clientX;dragY=e.clientY;if(hoveredProj&&!mouseOnCard)dismissPreview();return}
    ray.setFromCamera(mouse,camera);
    var hits=ray.intersectObjects(pinMeshes);
    if(hits.length){var p=hits[0].object.userData;cancelDismiss();hoveringPin=true;if(hoveredProj&&hoveredProj!==p)hidePreview();if(hoveredProj!==p)showPreview(p,e.clientX,e.clientY);canvas.style.cursor='pointer'}
    else{if(hoveredProj&&!mouseOnCard&&!dismissTimer)startDismiss();canvas.style.cursor='grab'}
  });
  canvas.addEventListener('mousedown',function(e){dragging=true;dragX=e.clientX;dragY=e.clientY;canvas.style.cursor='grabbing'});
  canvas.addEventListener('mouseup',function(){dragging=false;canvas.style.cursor='grab'});
  canvas.addEventListener('mouseleave',function(){dragging=false;if(!mouseOnCard)startDismiss()});

  preview.addEventListener('mouseenter',function(){mouseOnCard=true;cancelDismiss();hoveringPin=true});
  preview.addEventListener('mouseleave',function(){mouseOnCard=false;startDismiss()});

  // Touch
  var tX=0,tY=0;
  canvas.addEventListener('touchstart',function(e){e.preventDefault();dragging=true;tX=e.touches[0].clientX;tY=e.touches[0].clientY},{passive:false});
  canvas.addEventListener('touchmove',function(e){e.preventDefault();if(dragging){velY=(e.touches[0].clientX-tX)*0.0008;velX=(e.touches[0].clientY-tY)*0.0008;tX=e.touches[0].clientX;tY=e.touches[0].clientY}},{passive:false});
  canvas.addEventListener('touchend',function(){dragging=false});

  // Animate
  var t=0;
  function loop(){
    requestAnimationFrame(loop);t+=0.016;
    if(!dragging&&!hoveringPin){globeGroup.rotation.y+=0.00025;velX*=0.96;velY*=0.96}
    globeGroup.rotation.y+=velY;globeGroup.rotation.x=Math.max(-0.7,Math.min(0.7,globeGroup.rotation.x+velX));
    arcs.forEach(function(a){
      a.progress+=a.speed;if(a.progress>2.2)a.progress=0;
      var draw=Math.min(a.progress,1),trail=Math.max(0,a.progress-(a.hero?0.7:0.5));
      var s=Math.floor(trail*a.nPts),c=Math.floor(draw*a.nPts)-s;
      a.geom.setDrawRange(s,Math.max(0,c));a.glowGeom.setDrawRange(s,Math.max(0,c));
      if(a.progress<1){var pos=a.curve.getPoint(draw);a.td.position.copy(pos);a.td.material.opacity=0.95;a.tdGlow.position.copy(pos);a.tdGlow.material.opacity=a.hero?0.25:0.15}
      else{var fade=Math.max(0,1-(a.progress-1)*2.5);a.td.material.opacity=fade;a.tdGlow.material.opacity=fade*(a.hero?0.25:0.15)}
      var bOp=a.hero?0.55:0.35,glowOp=a.hero?0.15:0.08;
      a.line.material.opacity=a.progress<1?bOp:Math.max(0,bOp-(a.progress-1)*1.2);
      a.glowLine.material.opacity=a.progress<1?glowOp:Math.max(0,glowOp-(a.progress-1)*1.2);
    });
    pulseRings.forEach(function(p){var s=1+Math.sin(t*1.8)*0.4;p.scale.set(s,s,1);p.material.opacity=0.12+Math.sin(t*1.8)*0.08});
    renderer.render(scene,camera);
  }
  loop();

  // Resize — observe wrapper container
  var ro=new ResizeObserver(function(){var w=wrapper.clientWidth,h=wrapper.clientHeight;if(w>0&&h>0){camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}});
  ro.observe(wrapper);

  // Initial rotation — face Americas
  globeGroup.rotation.y=-1.5;
  globeGroup.rotation.x=0.2;

}).catch(function(e){console.warn('Globe dots decode failed:',e)});
});
}
