import { Receipt } from './lib/receipt.js';
import { ReceiptPrinter } from './lib/receipt-printer.js';
import { ReceiptSerial } from './lib/receipt-serial.js';
import "./bootstrap.scss";

ReceiptPrinter.init(Receipt);
ReceiptSerial.init(Receipt);
let conn = null;
const $status = document.getElementById('status');
const $open = document.getElementById('open');
$status.textContent = 'status';

const bc = new BroadcastChannel('receipt_printer');
const updateStatus = status => $status.textContent = status;

$open?.addEventListener('click',ev => {
  if(!conn)
  {
    conn = ReceiptSerial.connect();
    conn.on('ready',status => {
      $open.disabled = true;
      updateStatus('connected');
    });
    conn.on('status',status => {
      updateStatus(status);
    });
    conn.on('disconnect',status => {
      updateStatus(status);
      conn = null;
      $open.disabled = false;
    });
  }
});

bc.addEventListener('message',async ev => {
  const { origin } = ev;
  const { mode,markdown,options } = ev.data;
  if(origin !== location.origin)
    return;

  switch(mode)
  {
    case 'exists':
      bc.postMessage({ status: true });
      break;
      
    case 'print':
      if(markdown && conn)
        await conn.print(markdown, options ?? '-p epson -c 48 -l ja');
      break;
  }
})

window.addEventListener('close',ev => {
  bc.postMessage({ status: false },location.origin);
});