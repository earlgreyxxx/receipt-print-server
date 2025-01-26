import "./bootstrap.scss";
const defaultMarkdown = `\`^^^~~~Delivery~~~

Mar. 18, 2024 12:34 PM
Order #: ^56
-
{width:10,*}
^^^2 |^^Hamburger
{width:12,*}
||Tomato
||Meat Sauce
||Onion
||Mayonnaise
||Mustard
-
{width:10,*}
^^^2 |^^Coffee
{width:12,*}
||Soy Milk
-
{code:20240318123456;option:qrcode,5,h}

`;

let printer;
const bc = new BroadcastChannel('receipt_printer');
const printBtn = document.getElementById('submit-print');
const openBtn = document.getElementById('submit-open');

const $markdown = document.getElementById('markdown');
$markdown.value = defaultMarkdown;

printBtn?.addEventListener('click',ev => bc.postMessage({ mode: 'print',markdown: $markdown.value },location.origin));
openBtn?.addEventListener('click',ev => {
  window.open('./printer.html','printer','width=600,height=400');
  openBtn.disabled = true;
});

bc.addEventListener('message',ev => {
  const { origin,data } = ev;
  if(origin !== location.origin)
    return;

  const { status } = data ?? {};
    openBtn.disabled = !!status;
});

bc.postMessage({ mode: 'exists' });
