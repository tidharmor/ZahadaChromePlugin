// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.



function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function submitAnswer() {

    var answer = document.getElementById('answer_text').value;

    renderStatus('Submitting ' + answer + '...');
    
    var newUrl = baseUrl + answer + '.html';
            

    var x = new XMLHttpRequest();
    x.open('GET', newUrl);
    
    x.onreadystatechange = function () {

        if (x.readyState == 4 && x.status == 200) {
            var response = x.responseText;
            if (response.indexOf('404') != -1) {
                renderStatus('Wrong answer');
                return;
            }

            renderStatus('Right answer');

            chrome.tabs.update(null, { url: newUrl });

            renderStatus('Give it a try:');

        }

    };
    x.onerror = function () {
        renderStatus('Network Error');
    };
    x.send();
}

function text_keypress(e) {
    if (e.which == 13)
        submitAnswer();
}

var baseUrl = 'http://www.mcgov.co.uk/riddles/';

document.addEventListener('DOMContentLoaded', function () {

    renderStatus('Give it a try:');
    document.getElementById('answer_text').addEventListener('keypress', text_keypress);
    document.getElementById('submit_button').addEventListener('click', submitAnswer);

  
});


