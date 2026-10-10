import assert from 'node:assert/strict';
import {ticketHTML} from '../src/thermal.js';
const order={bill_number:'AGR-123',items:[{name:'<script>alert(1)</script>',qty:2,price:50,line_total:100}],total:100,tax:4.76,tax_rate:5,subtotal:95.24,created_at:new Date().toISOString(),payment:'UPI',staff_name:'Staff',staff_username:'cashier1'};
const bill=ticketHTML(order,'bill',58);assert(bill.includes('width:50mm'));assert(bill.includes('100.00'));assert(!bill.includes('<script>'));assert(bill.includes('&lt;script&gt;'));
const kot=ticketHTML(order,'kot',80);assert(kot.includes('KITCHEN ORDER TICKET'));assert(kot.includes('AGR-123'));assert(!kot.includes('100.00'));assert(!kot.includes('Included GST'));
console.log('Thermal bill/KOT layouts and escaping passed');
const {combinedTicketHTML}=await import('../src/thermal.js');
const combined=combinedTicketHTML(order,58);
assert.equal((combined.match(/<body>/g)||[]).length,1);
assert.equal((combined.match(/class="ticket /g)||[]).length,2);
assert.equal((combined.match(/AGR-123/g)||[]).length,3); // title plus both tickets
assert(combined.includes('break-before:page'));
const kitchen=combined.slice(combined.indexOf('class="ticket kitchen-ticket"'));
assert(kitchen.includes('KITCHEN ORDER TICKET'));
assert(!kitchen.includes('100.00'));
assert(combined.indexOf('BILL RECEIPT')<combined.indexOf('KITCHEN ORDER TICKET'));
console.log('Combined print contains bill then KOT in one document');

assert(bill.includes('Billed by: <b>Staff</b> (cashier1)'));assert(kot.includes('Billed by: <b>Staff</b> (cashier1)'));
const splitBill=ticketHTML({...order,payment:'Split',payments:[{method:'Cash',amount:'30.00'},{method:'UPI',amount:'60.00'},{method:'Card',amount:'10.00'}]},'bill',80);
for(const value of ['Cash','UPI','Card','30.00','60.00','10.00'])assert(splitBill.includes(value));
console.log('Split payment amounts present on thermal bill');
