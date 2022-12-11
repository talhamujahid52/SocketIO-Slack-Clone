const username = prompt("What is your usename?");
const socket1 = io("http://localhost:9000", {
  transports: ["websocket", "polling"],
  query: {
    username,
  },
});

let nsSocket = "";

socket1.on("nsList", (nsData) => {
  console.log("List of ns has Arrived", nsData);
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src=${ns.img}></img></div>`;
  });

  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      joinNs(nsEndpoint, username);

      // console.log(`${nsEndpoint} I should go now`);
    });
  });

  joinNs("/wiki", username);
});
