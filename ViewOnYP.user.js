// ==UserScript==
// @name         ViewOnYP
// @namespace    https://github.com/TheLastZombie/
// @version      1.0.1
// @description  Adds a YP button to the social links of Patreon artists.
// @downloadURL  https://raw.github.com/TheLastZombie/userscripts/master/ViewOnYP.user.js
// @author       TheLastZombie
// @match        https://www.patreon.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.js
// ==/UserScript==

$(function () {
    $.getJSON("https://yiff.party/json/creators.json", function (result) {
        result = result.creators.filter(x => x.name == window.location.pathname.slice(1))[0];
        if (result) {
            $("head").append(`<style>
                /* sc-component-id: sc-eNQAEJ */
                .bChsGU{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:#FAEBE8;border-radius:9999px;border:1px solid #FAEBE8;box-sizing:border-box;color:#E85B46 !important;cursor:default;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;font-size:0.875rem !important;font-weight:500;background-color:#F5F4F2;border-color:#F5F4F2;color:#B1ACA3 !important;height:unset;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:0.46875rem 1rem;position:relative;pointer-events:none;text-align:center;-webkit-text-decoration:none;text-decoration:none;text-transform:none;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:unset;width:100%;} @media (min-width:48rem){.bChsGU{font-size:1rem !important;}} @media (min-width:48rem){.bChsGU{height:unset;}} @media (min-width:48rem){.bChsGU{padding:0.78125rem 1.5rem;}} @media (min-width:48rem){.bChsGU{width:unset;}} .bChsGU:focus{outline:none;} .bChsGU:focus-visible{outline:none;box-shadow:0 0 0 3px #99D5FF;}.kLlPaJ{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:#E85B46;border-radius:9999px;border:1px solid #E85B46;box-sizing:border-box;color:#FFFFFF !important;cursor:pointer;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;font-size:1rem !important;font-weight:500;height:unset;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:0.78125rem 1.5rem;position:relative;pointer-events:unset;text-align:center;-webkit-text-decoration:none;text-decoration:none;text-transform:none;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:unset;width:unset;} .kLlPaJ:hover{background-color:#E7513B;} .kLlPaJ:active{background-color:#E54831;} .kLlPaJ:focus{outline:none;} .kLlPaJ:focus-visible{outline:none;box-shadow:0 0 0 3px #99D5FF;}.gRfBtv{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:#FAEBE8;border-radius:9999px;border:1px solid #FAEBE8;box-sizing:border-box;color:#E85B46 !important;cursor:pointer;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;font-size:1rem !important;font-weight:500;height:unset;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:0.78125rem 1.5rem;position:relative;pointer-events:unset;text-align:center;-webkit-text-decoration:none;text-decoration:none;text-transform:none;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:unset;width:unset;} .gRfBtv:hover{background-color:#F9E4DF;} .gRfBtv:active{background-color:#F8DCD7;} .gRfBtv:focus{outline:none;} .gRfBtv:focus-visible{outline:none;box-shadow:0 0 0 3px #99D5FF;}.WjDto{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:#F0EFED;border-radius:9999px;border:1px solid #F0EFED;box-sizing:border-box;color:#706C64 !important;cursor:pointer;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;font-size:0.875rem !important;font-weight:500;height:2.25rem;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:0rem 0.46875rem;position:relative;pointer-events:unset;text-align:center;-webkit-text-decoration:none;text-decoration:none;text-transform:none;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:unset;width:2.25rem;} .WjDto:hover{background-color:#ECEAE8;} .WjDto:active{background-color:#E8E6E2;} .WjDto:focus{outline:none;} .WjDto:focus-visible{outline:none;box-shadow:0 0 0 3px #99D5FF;}.lhimqi{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:#FAEBE8;border-radius:9999px;border:1px solid #FAEBE8;box-sizing:border-box;color:#E85B46 !important;cursor:pointer;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;font-size:0.875rem !important;font-weight:500;height:unset;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:0.46875rem 1rem;position:relative;pointer-events:unset;text-align:center;-webkit-text-decoration:none;text-decoration:none;text-transform:none;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:unset;width:100%;} .lhimqi:hover{background-color:#F9E4DF;} .lhimqi:active{background-color:#F8DCD7;} .lhimqi:focus{outline:none;} .lhimqi:focus-visible{outline:none;box-shadow:0 0 0 3px #99D5FF;}.kvdWiB{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:#FAEBE8;border-radius:9999px;border:1px solid #FAEBE8;box-sizing:border-box;color:#E85B46 !important;cursor:pointer;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;font-size:0.875rem !important;font-weight:500;height:2.25rem;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:0rem 0.46875rem;position:relative;pointer-events:unset;text-align:center;-webkit-text-decoration:none;text-decoration:none;text-transform:none;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:unset;width:2.25rem;} .kvdWiB:hover{background-color:#F9E4DF;} .kvdWiB:active{background-color:#F8DCD7;} .kvdWiB:focus{outline:none;} .kvdWiB:focus-visible{outline:none;box-shadow:0 0 0 3px #99D5FF;}
                /* sc-component-id: sc-1etnsv3-0 */
                .iaQWjD{display:inline-block;margin-top:1rem;} .iaQWjD:not(:last-child){margin-right:0.75rem;}
            </style>`);
            $(".sc-iwsKbI.exHrkV").append("<div class='sc-iwsKbI kxAqoU'><span class='sc-1etnsv3-0 iaQWjD'><a class='sc-eNQAEJ WjDto' href='https://yiff.party/patreon/" + result.id + "' target='_blank'><div class='sc-dxgOiQ hhhktq'><div class='sc-VigVT fAweOF'><span class='sc-gqjmRU hcoOws'>YP</span></div></div></a></span></div>");
        };
    });
});
