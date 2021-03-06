/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
(function () {
    function _subscribeToEnableDisable() {
        chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
            var uri = location.href;
            switch (request.action) {
            case "enable":
                break;
            case "disable":
                //HACK: ummm .... I am sorry
                uri = uri.replace(/enableripple=[^&]*[&]?/i, "").replace(/[\?&]*$/, "");
                break;

            default:
                throw {name: "MethodNotImplemented", message: "Requested action is not supported!"};
            }

            if (location.href !== uri) {
                location.href = uri;
            }
            else {
                location.reload();
            }
        });
    }

    function _enableBus() {
        document.addEventListener("bus-init", function (e) {
            var send = document.getElementById("bus-send"),
                receive = document.getElementById("bus-receive");

            send.addEventListener("DOMNodeInserted", function (evt) {
                var action = evt.target.dataset.msg,
                    data = JSON.parse(evt.target.textContent);

                chrome.extension.sendRequest({
                    action: action,
                    data: evt.target.textContent
                }, function (response) {
                    var m = document.createElement("span");
                    m.dataset.msg = evt.target.dataset.callback;
                    m.innerHTML = JSON.stringify(response);
                    receive.appendChild(m);
                });
            });
        });
    }

    _subscribeToEnableDisable();

    chrome.extension.sendRequest({"action": "isEnabled", "tabURL": location.href }, function (response) {
        if (response.enabled) {
            _enableBus();
        }
    });
}());
