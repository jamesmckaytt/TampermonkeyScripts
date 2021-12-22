// ==UserScript==
// @name         QueryResultsToCSV
// @namespace    https://github.com/jamesmckaytt/TampermonkeyScripts
// @version      0.2
// @description  Save SF Dev console query results to a csv file. Fairly dumb, won't handle objects.
// @author       James McKay
// @match        https://*.my.salesforce.com/_ui/common/apex/debug/ApexCSIPage
// @grant        none
// @downloadURL  https://github.com/jamesmckaytt/TampermonkeyScripts/raw/main/QueryResultsToCSV.user.js
// ==/UserScript==

(function() {
    'use strict';

    function saveAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    }


    let fDoStuff = function() {
        document.querySelectorAll('.x-panel .x-panel-body .x-panel.x-grid .x-toolbar > div > div').forEach(function(el){
            if(el.hasCSVButton)
            {
                return;
            }
            el.hasCSVButton = true;

            let newEl = document.createElement('div');
            newEl.class = 'x-btn x-box-item x-toolbar-item x-btn-default-toolbar-small x-noicon x-btn-noicon x-btn-default-toolbar-small-noicon';
            newEl.style.borderWidth = '1px';
            newEl.style.position = 'absolute';
            newEl.style.left = '400px';
            newEl.style.margin = 0;
            newEl.style.top = 0;

            let newButton = document.createElement('button');
            newButton.type = "button";
            newButton.addEventListener('click', function(ev) {
                (function() { let lineArray = []; Array.from(document.querySelectorAll('#editors-body > .x-panel:last-child > .x-panel-body-default .x-grid-view table > tbody > tr.x-grid-row')).map(function(el){ return (Array.from(el.querySelectorAll('td')).map(function(d){ return d.innerText.replaceAll('"', '""'); }));}).forEach(function(a,i){ let line = a.join(','); lineArray.push(i == 0 ? "data:text/csv;charset=utf-8," + line : line) }); let s = lineArray.join('\n'); saveAs(s, 'results-' + (new Date()).toISOString() + '.csv'); }())
            });
            newButton.innerText = 'Get CSV';

            newEl.appendChild(newButton);
            el.appendChild(newEl);
        })
    };
    setInterval(fDoStuff, 5000);
})();
