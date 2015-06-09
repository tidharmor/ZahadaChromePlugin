// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.



function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function submitAnswer() {

    var answer = document.getElementById('answer_text').value;

    renderStatus('Submitting ' + answer + '...');

    openAnswerUrl(answer);
}

function openAnswerUrl(answer) {
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

            // Save it using the Chrome extension storage API.
            chrome.storage.sync.set({ 'answer': answer }, function () {
                // Notify that we saved.
                renderStatus('Progress saved');
            });

            chrome.tabs.update(null, { url: newUrl });

        }

        document.getElementById('answer_text').focus();

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

function restoreProgress() {

    chrome.storage.sync.get('answer', function (items) {
        
        for (key in items) {
            if (key == 'answer') {
                var newUrl = baseUrl + items[key] + '.html';
                chrome.tabs.create({ 'url': newUrl}, function (tab) {
                    
                });
            }
        }

    });
}

document.addEventListener('DOMContentLoaded', function () {

    renderStatus('Give it a try:');
    document.getElementById('answer_text').addEventListener('keypress', text_keypress);
    document.getElementById('submit_button').addEventListener('click', submitAnswer);
    document.getElementById('restore_button').addEventListener('click', restoreProgress);

    document.getElementById('answer_text').focus();
});


