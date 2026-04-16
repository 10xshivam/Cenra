(function(){"use strict";const o={WIDGET_URL:(document.currentScript&&document.currentScript.src)?new URL(document.currentScript.src).origin:"http://localhost:3001",DEFAULT_POSITION:"bottom-right"},u=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40" viewBox="0 0 375 375" fill="none"><path fill="#ffffff" d="M 96.164062 247.359375 C 63.789062 247.359375 37.503906 221.074219 37.503906 188.699219 C 37.503906 158.558594 60.234375 133.71875 89.535156 130.464844 C 98.394531 84.402344 138.847656 49.617188 187.5 49.617188 C 236.152344 49.617188 276.605469 84.402344 285.46875 130.464844 C 314.765625 133.71875 337.496094 158.558594 337.496094 188.699219 C 337.496094 218.601562 315.128906 243.261719 286.25 246.878906 C 276.484375 291.730469 236.574219 325.371094 188.765625 325.371094 C 188.285156 325.371094 187.863281 325.371094 187.378906 325.371094 L 187.320312 325.371094 C 175.140625 325.371094 165.253906 319.703125 165.253906 312.710938 C 165.253906 305.65625 175.140625 299.992188 187.320312 299.992188 C 199.558594 299.992188 209.445312 305.65625 209.445312 312.710938 C 209.445312 313.855469 209.203125 315.003906 208.660156 316.085938 C 243.265625 308.550781 270.574219 281.664062 278.835938 247.359375 L 278.835938 133.777344 C 271.417969 90.070312 233.378906 56.730469 187.5 56.730469 C 141.621094 56.730469 103.582031 90.070312 96.164062 133.777344 Z M 226.746094 228.671875 C 224.878906 245.914062 207.273438 259.476562 185.8125 259.476562 C 164.410156 259.476562 146.804688 245.914062 144.9375 228.671875 C 152.230469 240.066406 167.785156 247.964844 185.8125 247.964844 C 203.898438 247.964844 219.453125 240.066406 226.746094 228.671875 Z" /></svg>`,x=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;(function(){let n=null,e=null,t=null,d=!1,r=null,s=o.DEFAULT_POSITION,c="#047857";const i=document.currentScript;if(i)r=i.getAttribute("data-workspace-id"),s=i.getAttribute("data-position")||o.DEFAULT_POSITION,c=i.getAttribute("data-theme-color")||c;else{const a=document.querySelectorAll('script[src*="embed"]'),l=Array.from(a).find(h=>h.hasAttribute("data-workspace-id"));l&&(r=l.getAttribute("data-workspace-id"),s=l.getAttribute("data-position")||o.DEFAULT_POSITION,c=l.getAttribute("data-theme-color")||c)}if(!r){console.error("Cenra Widget: data-workspace-id attribute is required");return}function h(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()}function f(){t=document.createElement("button"),t.id="cenra-widget-button",t.innerHTML=u,t.style.cssText=`
      position: fixed;
      ${s==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${c};
      color: white;
      border: none;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px ${c}59;
      transition: all 0.2s ease, background 0.3s ease, box-shadow 0.3s ease;
    `,t.addEventListener("click",y),t.addEventListener("mouseenter",()=>{t&&(t.style.transform="scale(1.05)")}),t.addEventListener("mouseleave",()=>{t&&(t.style.transform="scale(1)")}),document.body.appendChild(t),e=document.createElement("div"),e.id="cenra-widget-container",e.style.cssText=`
      position: fixed;
      ${s==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 90px;
      width: 410px;
      height: 730px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      z-index: 999998;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `,n=document.createElement("iframe"),n.src=b(),n.style.cssText=`
      width: 100%;
      height: 100%;
      border: none;
    `,n.allow="microphone; clipboard-read; clipboard-write",e.appendChild(n),document.body.appendChild(e),window.addEventListener("message",m)}function b(){const i=new URLSearchParams;return i.append("workspaceId",r),`${o.WIDGET_URL}?${i.toString()}`}function m(i){if(i.origin!==new URL(o.WIDGET_URL).origin)return;const{type:a,payload:l}=i.data;switch(a){case"close":p();break;case"theme_update":l.color&&(c=l.color,t&&(t.style.background=c,t.style.boxShadow=`0 4px 24px ${c}59`));break;case"resize":l.height&&e&&(e.style.height=`${l.height}px`);break}}function y(){d?p():g()}function g(){e&&t&&(d=!0,e.style.display="block",setTimeout(()=>{e&&(e.style.opacity="1",e.style.transform="translateY(0)")},10),t.innerHTML=x)}function p(){e&&t&&(d=!1,e.style.opacity="0",e.style.transform="translateY(10px)",setTimeout(()=>{e&&(e.style.display="none")},300),t.innerHTML=u,t.style.background=c)}function w(){window.removeEventListener("message",m),e&&(e.remove(),e=null,n=null),t&&(t.remove(),t=null),d=!1}function k(i){w(),i.workspaceId&&(r=i.workspaceId),i.position&&(s=i.position),c=i.themeColor||c,h()}window.CenraWidget={init:k,show:g,hide:p,destroy:w},h()})()})();
