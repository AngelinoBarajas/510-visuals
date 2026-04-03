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

// Decode compressed continent dots
function decodeDots(b64){
  var bin=atob(b64);var raw=new Uint8Array(bin.length);
  for(var i=0;i<bin.length;i++) raw[i]=bin.charCodeAt(i);
  var ds=new DecompressionStream('deflate');
  var writer=ds.writable.getWriter();
  var reader=ds.readable.getReader();
  writer.write(raw.slice(2));writer.close();
  return new Response(new ReadableStream({start:function(c){(async function(){while(true){var r=await reader.read();if(r.done){c.close();return}c.enqueue(r.value)}})()}})).arrayBuffer().then(function(buf){
    var view=new DataView(buf);var dots=[];
    for(var i=0;i<buf.byteLength;i+=4) dots.push([view.getInt16(i,true)/100,view.getInt16(i+2,true)/100]);
    return dots;
  });
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
    projects.push({
      city:el.getAttribute('data-globe-city')||'',
      region:'',lat:lat,lng:lng,
      title:el.getAttribute('data-globe-title')||'',
      img:el.getAttribute('data-globe-img')||'',
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
  renderer.setClearColor(PAL.dark,1);

  var scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(PAL.dark,0.08);
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
  globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.18,64,64),new THREE.ShaderMaterial({
    vertexShader:'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec3 vN;void main(){float i=pow(0.62-dot(vN,vec3(0,0,1)),2.8);gl_FragColor=vec4(0.345,0.525,0.58,1.)*i*0.45;}',
    blending:THREE.AdditiveBlending,side:THREE.BackSide,transparent:true
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
