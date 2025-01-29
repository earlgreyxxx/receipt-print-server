import "./bootstrap.scss";
Date.prototype.toCustomString = function(options = {})
{
  const { hasTime,hasSecond } = options;
  const bdigit = (n,d = 2) => `0${parseInt(n).toString()}`.slice(-1 * d);
  const yyyy = this.getFullYear();
  const mm = bdigit(this.getMonth() + 1);
  const dd = bdigit(this.getDate());
  let rv = `${yyyy}年${mm}月${dd}日`;

  if(hasTime === true)
  {
    const hh = bdigit(this.getHours());
    const nn = bdigit(this.getMinutes());
    const ss = bdigit(this.getSeconds());
    
    rv = `${rv} ${hh}時${nn}分` + (hasSecond === true ? `${ss}秒` : '');
  }
  return  rv;
}

const template = (libname,date,lendings,period) => `\`^^^~~~${libname}~~~

^*** 貸出日時 ***
${date}
-
図書コード | 書名
-
${lendings.map(({code,name}) => `${code} | ${name.length > 12 ? (name.slice(0,11) + '…') : name}`).join('\n')}
-
計 | ${lendings.length}冊

\`^^~~~~返却期限~~~~

^^^_"${period}

=`;

const sample = [
  {code: '012356783',name: 'これはテストです'},
  {code: '012356783',name: 'これはテストです'},
  {code: '012356783',name: 'これはテストですこれはテストですこれはテストです'},
  {code: '012356783',name: 'これはテストです'}
];

let printer;
const bc = new BroadcastChannel('receipt_printer');
const printBtn = document.getElementById('submit-print');
const openBtn = document.getElementById('submit-open');
const $markdown = document.getElementById('markdown');
const today = new Date;

const date = new Date;
const period = new Date();
period.setDate(period.getDate() + 7);

$markdown.value = template('第一中学校',date.toCustomString({hasTime: true}),sample,period.toCustomString())
$markdown.style.height = '15rem';

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
