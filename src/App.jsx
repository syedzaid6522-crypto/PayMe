import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight, Check, CheckCircle2, Clock, AlertCircle, Send, Plus, Search,
  Bell, HelpCircle, ChevronDown, ChevronRight, FileText, Users, CreditCard,
  BarChart3, Settings, ShieldCheck, Sparkles, MessageSquare, Mail, ExternalLink,
  Download, Printer, Filter, ArrowUpDown, Calendar, Building2, Globe, Smartphone,
  RefreshCw, Lock, LogOut, Menu, X, Eye, Trash2, Edit3, Copy, CheckCheck,
  TrendingUp, TrendingDown, Zap, Layers, Sliders, Key, Server, Database,
  AlertTriangle, Play, Pause, UserPlus, Award, HelpCircle as QuestionIcon,
  Receipt, Wallet, QrCode, Landmark, ChevronUp, Info
} from 'lucide-react';

// ============================================================================
// 1. CONSTANTS, CURRENCY HELPERS & INITIAL DEMO SEED DATA
// ============================================================================

const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro' },
};

const formatMoney = (amount, currencyCode = 'INR') => {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const num = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(curr.locale, {
      style: 'currency',
      currency: curr.code,
      maximumFractionDigits: num % 1 === 0 ? 0 : 2,
    }).format(num);
  } catch {
    return `${curr.symbol}${num.toLocaleString()}`;
  }
};

// Reference "Today" aligned with current system date: Nov 25, 2026
const TODAY_STR = '2026-11-25';

const INITIAL_PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceINR: 0,
    invoiceLimit: 5,
    description: 'Essential invoice tracking for solo operators just getting started.',
    highlighted: false,
    cta: 'Start Free',
    features: [
      '5 active invoices',
      'Basic email reminders',
      'Customer management',
      'Basic payment dashboard',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceINR: 499,
    invoiceLimit: 50,
    description: 'Automated WhatsApp & Email follow-ups for growing SMBs.',
    highlighted: true,
    cta: 'Start Pro',
    features: [
      '50 active invoices',
      'Official WhatsApp reminders',
      'Automated Email reminders',
      'Hosted Payment Links (UPI/Cards)',
      'Custom reminder schedules',
      'Collection & Aging reports',
      'Reminder templates & AI assistant',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    priceINR: 999,
    invoiceLimit: 200,
    description: 'Full-scale accounts receivable automation for teams & distributors.',
    highlighted: false,
    cta: 'Choose Business',
    features: [
      '200 active invoices',
      'Everything in Pro',
      'Multiple team users & roles',
      'Advanced aging & cohort reports',
      'Priority WhatsApp & phone support',
      'Custom branding on payment pages',
      'Smart escalation automation',
    ],
  },
];

const INITIAL_BUSINESS = {
  id: 'biz_apex_01',
  name: 'Apex Industrial Supplies',
  type: 'Wholesale & Distribution',
  address: 'Plot 42, Peenya Industrial Area Phase II, Bengaluru, Karnataka 560058',
  gstin: '29AABCA4821M1Z5',
  website: 'https://apexindustrial.in',
  email: 'accounts@apexindustrial.in',
  phone: '+91 98450 72190',
  currency: 'INR',
  plan: 'pro',
  whatsappConnected: true,
  whatsappNumber: '+91 98450 72190',
  emailConnected: true,
  paymentGatewayConnected: true,
  paymentProvider: 'Razorpay',
  reminderSchedule: [
    { id: 'sch_1', label: '3 days before due date', offsetDays: -3, channel: 'email', enabled: true },
    { id: 'sch_2', label: 'On the due date', offsetDays: 0, channel: 'whatsapp', enabled: true },
    { id: 'sch_3', label: '2 days after due date', offsetDays: 2, channel: 'whatsapp', enabled: true },
    { id: 'sch_4', label: '7 days after due date', offsetDays: 7, channel: 'whatsapp', enabled: true },
    { id: 'sch_5', label: '14 days after due date (Final)', offsetDays: 14, channel: 'email', enabled: true },
  ],
};

const INITIAL_CUSTOMERS = [
  {
    id: 'cust_1',
    name: 'Rohan Kulkarni',
    company: 'ABC Restaurant',
    phone: '+91 98201 44120',
    whatsapp: '+91 98201 44120',
    email: 'accounts@abcrestaurant.in',
    address: '14 MG Road, Indiranagar, Bengaluru',
    optedOutWhatsapp: false,
    createdAt: '2026-08-12',
  },
  {
    id: 'cust_2',
    name: 'Vikram Sharma',
    company: 'Sharma Traders',
    phone: '+91 98111 65230',
    whatsapp: '+91 98111 65230',
    email: 'vikram@sharmatraders.co.in',
    address: '88 Chickpet Main Road, Bengaluru',
    optedOutWhatsapp: false,
    createdAt: '2026-07-04',
  },
  {
    id: 'cust_3',
    name: 'Ananya Nair',
    company: 'Metro Distributors',
    phone: '+91 98400 88912',
    whatsapp: '+91 98400 88912',
    email: 'finance@metrodistributors.in',
    address: '210 Electronic City Phase 1, Bengaluru',
    optedOutWhatsapp: false,
    createdAt: '2026-06-19',
  },
  {
    id: 'cust_4',
    name: 'Karthik Reddy',
    company: 'BlueLine Events',
    phone: '+91 99001 33418',
    whatsapp: '+91 99001 33418',
    email: 'karthik@bluelineevents.in',
    address: '5th Block, Koramangala, Bengaluru',
    optedOutWhatsapp: false,
    createdAt: '2026-09-01',
  },
  {
    id: 'cust_5',
    name: 'Suresh Menon',
    company: 'Prime Hardware',
    phone: '+91 97412 50987',
    whatsapp: '+91 97412 50987',
    email: 'billing@primehardware.in',
    address: '19 Yeshwanthpur Industrial Suburb, Bengaluru',
    optedOutWhatsapp: false,
    createdAt: '2026-05-22',
  },
];

const INITIAL_INVOICES = [
  {
    id: 'inv_1045',
    invoiceNumber: 'INV-1045',
    customerId: 'cust_1',
    invoiceDate: '2026-11-03',
    dueDate: '2026-11-18', // 7 days overdue relative to Nov 25, 2026
    currency: 'INR',
    items: [
      { id: 'li_1', description: 'Commercial Kitchen Exhaust Ducting & Fittings', quantity: 2, rate: 18500, tax: 18 },
      { id: 'li_2', description: 'Stainless Steel Prep Table (Heavy Duty)', quantity: 1, rate: 4101.69, tax: 18 },
    ],
    subtotal: 41101.69,
    taxTotal: 7398.31,
    total: 48500,
    amountPaid: 0,
    amountDue: 48500,
    status: 'Overdue',
    notes: 'Thank you for your business. Please quote INV-1045 on NEFT/UPI transfers.',
    paymentInstructions: 'Pay instantly via UPI, NetBanking, or Card using the secure PayMe link.',
    lastReminderAt: 'Yesterday, 10:30 AM',
    timeline: [
      { id: 'tl_1', date: 'Nov 25, 2026 · 09:00 AM', text: 'Reminder sent via WhatsApp (+91 98201 44120)', type: 'whatsapp' },
      { id: 'tl_2', date: 'Nov 24, 2026 · 10:30 AM', text: 'Email reminder delivered to accounts@abcrestaurant.in', type: 'email' },
      { id: 'tl_3', date: 'Nov 18, 2026 · 12:01 AM', text: 'Invoice became overdue', type: 'alert' },
      { id: 'tl_4', date: 'Nov 15, 2026 · 09:00 AM', text: 'Pre-due reminder sent via Email', type: 'email' },
      { id: 'tl_5', date: 'Nov 03, 2026 · 04:15 PM', text: 'Invoice INV-1045 created & payment link generated', type: 'created' },
    ],
  },
  {
    id: 'inv_1046',
    invoiceNumber: 'INV-1046',
    customerId: 'cust_2',
    invoiceDate: '2026-11-14',
    dueDate: '2026-11-28', // Due in 3 days
    currency: 'INR',
    items: [
      { id: 'li_3', description: 'Industrial Fasteners & Anchor Bolts Box (500 pcs)', quantity: 10, rate: 1779.66, tax: 18 },
    ],
    subtotal: 17796.61,
    taxTotal: 3203.39,
    total: 21000,
    amountPaid: 0,
    amountDue: 21000,
    status: 'Upcoming',
    notes: 'Net 14 payment terms.',
    paymentInstructions: 'UPI ID: apexindustrial@icici or pay via link.',
    lastReminderAt: 'Today, 09:00 AM',
    timeline: [
      { id: 'tl_6', date: 'Nov 25, 2026 · 09:00 AM', text: '3-day advance reminder sent via Email', type: 'email' },
      { id: 'tl_7', date: 'Nov 14, 2026 · 02:20 PM', text: 'Invoice INV-1046 created & scheduled', type: 'created' },
    ],
  },
  {
    id: 'inv_1047',
    invoiceNumber: 'INV-1047',
    customerId: 'cust_3',
    invoiceDate: '2026-11-01',
    dueDate: '2026-11-15',
    currency: 'INR',
    items: [
      { id: 'li_4', description: 'Heavy Duty Pallet Wrapping Film (24 Rolls)', quantity: 15, rate: 4237.29, tax: 18 },
    ],
    subtotal: 63559.32,
    taxTotal: 11440.68,
    total: 75000,
    amountPaid: 75000,
    amountDue: 0,
    status: 'Paid',
    notes: 'Paid in full via Razorpay UPI.',
    paymentInstructions: 'Settled.',
    lastReminderAt: 'Nov 12, 2026',
    timeline: [
      { id: 'tl_8', date: 'Nov 14, 2026 · 03:42 PM', text: 'Payment of ₹75,000 received via Razorpay UPI · Future reminders cancelled', type: 'paid' },
      { id: 'tl_9', date: 'Nov 12, 2026 · 09:00 AM', text: '3-day advance reminder sent via Email', type: 'email' },
      { id: 'tl_10', date: 'Nov 01, 2026 · 11:00 AM', text: 'Invoice INV-1047 created', type: 'created' },
    ],
  },
  {
    id: 'inv_1048',
    invoiceNumber: 'INV-1048',
    customerId: 'cust_4',
    invoiceDate: '2026-10-20',
    dueDate: '2026-11-05', // 20 days overdue -> Severely Overdue
    currency: 'INR',
    items: [
      { id: 'li_5', description: 'Modular Aluminum Truss Sections & Clamps', quantity: 4, rate: 14830.51, tax: 18 },
    ],
    subtotal: 59322.03,
    taxTotal: 10677.97,
    total: 70000,
    amountPaid: 0,
    amountDue: 70000,
    status: 'Severely Overdue',
    notes: 'Urgent settlement requested for Q4 event setup.',
    paymentInstructions: 'Use PayMe checkout link for instant receipt.',
    lastReminderAt: '2 days ago',
    timeline: [
      { id: 'tl_11', date: 'Nov 23, 2026 · 11:15 AM', text: 'Final escalation notice sent via Email & WhatsApp', type: 'whatsapp' },
      { id: 'tl_12', date: 'Nov 12, 2026 · 10:00 AM', text: '7-day overdue reminder delivered via WhatsApp', type: 'whatsapp' },
      { id: 'tl_13', date: 'Nov 05, 2026 · 12:01 AM', text: 'Invoice became overdue', type: 'alert' },
      { id: 'tl_14', date: 'Oct 20, 2026 · 05:10 PM', text: 'Invoice INV-1048 created', type: 'created' },
    ],
  },
  {
    id: 'inv_1049',
    invoiceNumber: 'INV-1049',
    customerId: 'cust_5',
    invoiceDate: '2026-11-10',
    dueDate: '2026-11-25', // Due Today!
    currency: 'INR',
    items: [
      { id: 'li_6', description: 'Copper Electrical Cabling 2.5sqmm (30 Coils)', quantity: 30, rate: 1497.18, tax: 18 },
    ],
    subtotal: 44915.25,
    taxTotal: 8084.75,
    total: 53000,
    amountPaid: 0,
    amountDue: 53000,
    status: 'Due Today',
    notes: 'Due today as per agreed credit cycle.',
    paymentInstructions: 'Pay online via UPI/NetBanking.',
    lastReminderAt: 'Today, 08:30 AM',
    timeline: [
      { id: 'tl_15', date: 'Nov 25, 2026 · 08:30 AM', text: 'Due-today WhatsApp reminder sent to +91 97412 50987', type: 'whatsapp' },
      { id: 'tl_16', date: 'Nov 22, 2026 · 09:00 AM', text: '3-day advance reminder sent via Email', type: 'email' },
      { id: 'tl_17', date: 'Nov 10, 2026 · 01:05 PM', text: 'Invoice INV-1049 created', type: 'created' },
    ],
  },
  {
    id: 'inv_1050',
    invoiceNumber: 'INV-1050',
    customerId: 'cust_2',
    invoiceDate: '2026-11-05',
    dueDate: '2026-12-05',
    currency: 'INR',
    items: [
      { id: 'li_7', description: 'Industrial Safety Helmets & Reflective Jackets Batch', quantity: 200, rate: 1440.68, tax: 18 },
    ],
    subtotal: 288135.59,
    taxTotal: 51864.41,
    total: 340000,
    amountPaid: 50000,
    amountDue: 290000,
    status: 'Partially Paid',
    notes: 'Advance of ₹50,000 received. Remaining balance ₹2,90,000 due Dec 05.',
    paymentInstructions: 'Pay remaining balance via PayMe link.',
    lastReminderAt: 'Nov 18, 2026',
    timeline: [
      { id: 'tl_18', date: 'Nov 18, 2026 · 04:10 PM', text: 'Partial payment of ₹50,000 recorded. Remaining balance: ₹2,90,000', type: 'paid' },
      { id: 'tl_19', date: 'Nov 05, 2026 · 10:45 AM', text: 'Invoice INV-1050 created', type: 'created' },
    ],
  },
];

const INITIAL_PAYMENTS = [
  {
    id: 'pay_901',
    paymentRef: 'PAY-88412',
    invoiceId: 'inv_1047',
    invoiceNumber: 'INV-1047',
    customerId: 'cust_3',
    customerName: 'Metro Distributors',
    amount: 75000,
    currency: 'INR',
    date: '2026-11-14 15:42',
    method: 'UPI (Razorpay)',
    status: 'Successful',
  },
  {
    id: 'pay_902',
    paymentRef: 'PAY-88509',
    invoiceId: 'inv_1050',
    invoiceNumber: 'INV-1050',
    customerId: 'cust_2',
    customerName: 'Sharma Traders',
    amount: 50000,
    currency: 'INR',
    date: '2026-11-18 16:10',
    method: 'NEFT / Bank Transfer',
    status: 'Successful',
  },
  {
    id: 'pay_903',
    paymentRef: 'PAY-88104',
    invoiceId: 'inv_1042',
    invoiceNumber: 'INV-1042',
    customerId: 'cust_1',
    customerName: 'ABC Restaurant',
    amount: 112000,
    currency: 'INR',
    date: '2026-11-06 11:20',
    method: 'UPI (Razorpay)',
    status: 'Successful',
  },
  {
    id: 'pay_904',
    paymentRef: 'PAY-87990',
    invoiceId: 'inv_1039',
    invoiceNumber: 'INV-1039',
    customerId: 'cust_5',
    customerName: 'Prime Hardware',
    amount: 87000,
    currency: 'INR',
    date: '2026-11-02 18:05',
    method: 'Corporate Card',
    status: 'Successful',
  },
  {
    id: 'pay_905',
    paymentRef: 'PAY-88612',
    invoiceId: 'inv_1045',
    invoiceNumber: 'INV-1045',
    customerId: 'cust_1',
    customerName: 'ABC Restaurant',
    amount: 48500,
    currency: 'INR',
    date: '2026-11-24 14:12',
    method: 'NetBanking',
    status: 'Failed',
  },
];

const INITIAL_TEMPLATES = [
  {
    id: 'tpl_friendly',
    name: 'Friendly Pre-Due Reminder',
    type: 'Friendly',
    channel: 'Email & WhatsApp',
    subject: 'Friendly reminder: Invoice {{invoice_number}} due on {{due_date}}',
    body: 'Hi {{customer_name}}, just a friendly reminder from {{business_name}} that invoice {{invoice_number}} for {{amount_due}} is due on {{due_date}}. You can pay securely anytime here: {{payment_link}}',
  },
  {
    id: 'tpl_duetoday',
    name: 'Due Today Notice',
    type: 'Due Today',
    channel: 'WhatsApp',
    subject: 'Invoice {{invoice_number}} is due today',
    body: 'Hi {{customer_name}}, invoice {{invoice_number}} for {{amount_due}} is due today ({{due_date}}). Make a quick payment via UPI/Card here: {{payment_link}} — {{business_name}}',
  },
  {
    id: 'tpl_overdue',
    name: 'Overdue Follow-Up',
    type: 'Overdue',
    channel: 'WhatsApp & Email',
    subject: 'Overdue Payment Reminder — Invoice {{invoice_number}}',
    body: 'Hi {{customer_name}}, invoice {{invoice_number}} is currently overdue. The remaining balance is {{amount_due}}. Please arrange payment at your earliest convenience using this link: {{payment_link}}',
  },
  {
    id: 'tpl_final',
    name: 'Final Notice',
    type: 'Final Reminder',
    channel: 'Email & WhatsApp',
    subject: 'Final Reminder: Outstanding Invoice {{invoice_number}}',
    body: 'Hi {{customer_name}}, this is a final payment reminder from {{business_name}} regarding invoice {{invoice_number}}. Outstanding amount: {{amount_due}}. Kindly clear the balance today via {{payment_link}} or reply to confirm your payment date.',
  },
];

const INITIAL_REMINDER_JOBS = [
  {
    id: 'rem_1',
    invoiceId: 'inv_1045',
    invoiceNumber: 'INV-1045',
    customerName: 'ABC Restaurant',
    channel: 'WhatsApp',
    templateName: 'Overdue Follow-Up',
    scheduledAt: '2026-11-25 09:00',
    status: 'Delivered',
  },
  {
    id: 'rem_2',
    invoiceId: 'inv_1049',
    invoiceNumber: 'INV-1049',
    customerName: 'Prime Hardware',
    channel: 'WhatsApp',
    templateName: 'Due Today Notice',
    scheduledAt: '2026-11-25 08:30',
    status: 'Delivered',
  },
  {
    id: 'rem_3',
    invoiceId: 'inv_1046',
    invoiceNumber: 'INV-1046',
    customerName: 'Sharma Traders',
    channel: 'WhatsApp',
    templateName: 'Due Today Notice',
    scheduledAt: '2026-11-28 09:00',
    status: 'Scheduled',
  },
  {
    id: 'rem_4',
    invoiceId: 'inv_1045',
    invoiceNumber: 'INV-1045',
    customerName: 'ABC Restaurant',
    channel: 'Email',
    templateName: 'Final Notice',
    scheduledAt: '2026-12-02 09:00',
    status: 'Scheduled',
  },
  {
    id: 'rem_5',
    invoiceId: 'inv_1050',
    invoiceNumber: 'INV-1050',
    customerName: 'Sharma Traders',
    channel: 'Email',
    templateName: 'Friendly Pre-Due Reminder',
    scheduledAt: '2026-12-02 09:00',
    status: 'Scheduled',
  },
  {
    id: 'rem_6',
    invoiceId: 'inv_1047',
    invoiceNumber: 'INV-1047',
    customerName: 'Metro Distributors',
    channel: 'WhatsApp',
    templateName: 'Due Today Notice',
    scheduledAt: '2026-11-15 09:00',
    status: 'Cancelled',
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    text: 'ABC Restaurant paid ₹1,12,000 towards INV-1042.',
    time: '2 hours ago',
    type: 'success',
    unread: true,
  },
  {
    id: 'notif_2',
    text: 'Invoice INV-1045 (ABC Restaurant) is now 7 days overdue.',
    time: '5 hours ago',
    type: 'danger',
    unread: true,
  },
  {
    id: 'notif_3',
    text: 'Invoice INV-1049 (Prime Hardware · ₹53,000) is due today.',
    time: 'Today, 08:30 AM',
    type: 'warning',
    unread: true,
  },
  {
    id: 'notif_4',
    text: 'You have ₹74,000 due this week across 2 invoices.',
    time: 'Yesterday',
    type: 'info',
    unread: false,
  },
];

// ============================================================================
// 2. HELPER UI COMPONENTS (BADGES, TOASTS, MODALS)
// ============================================================================

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    Successful: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    Upcoming: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    Scheduled: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    'Due Today': 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    'Partially Paid': 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    Overdue: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    'Severely Overdue': 'bg-red-100 text-red-800 border-red-300 ring-red-600/30 font-semibold',
    Failed: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    Draft: 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-400/20',
    Cancelled: 'bg-slate-100 text-slate-500 border-slate-200 ring-slate-400/20',
    Refunded: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
  };

  const dots = {
    Paid: 'bg-emerald-500',
    Successful: 'bg-emerald-500',
    Delivered: 'bg-emerald-500',
    Upcoming: 'bg-blue-500',
    Scheduled: 'bg-blue-500',
    'Due Today': 'bg-amber-500',
    'Partially Paid': 'bg-indigo-500',
    Pending: 'bg-amber-500',
    Overdue: 'bg-rose-500',
    'Severely Overdue': 'bg-red-600 animate-pulse',
    Failed: 'bg-rose-500',
    Draft: 'bg-slate-400',
    Cancelled: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        styles[status] || styles.Draft
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      {status}
    </span>
  );
};

const PayMeLogo = ({ size = 'md', onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2.5 text-left focus:outline-none group"
  >
    <div
      className={`${
        size === 'sm' ? 'w-7 h-7 rounded-lg' : 'w-9 h-9 rounded-xl'
      } bg-[#0F172A] flex items-center justify-center text-white shadow-sm group-hover:bg-blue-600 transition-colors`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    </div>
    <span
      className={`font-bold tracking-tight text-[#0F172A] ${
        size === 'sm' ? 'text-lg' : 'text-xl'
      }`}
    >
      Pay<span className="text-blue-600">Me</span>
    </span>
  </button>
);

// ============================================================================
// 3. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Navigation & Auth View State
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'auth' | 'onboarding' | 'app' | 'public_pay'
  const [authSubView, setAuthSubView] = useState('login'); // 'login' | 'signup' | 'forgot' | 'reset'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'invoices' | 'customers' | 'payments' | 'reminders' | 'reports' | 'settings' | 'admin'
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [publicPayInvoiceId, setPublicPayInvoiceId] = useState('inv_1045');

  // Persistent SaaS State
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(INITIAL_BUSINESS);
  const [pricingPlans, setPricingPlans] = useState(INITIAL_PRICING_PLANS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [reminderJobs, setReminderJobs] = useState(INITIAL_REMINDER_JOBS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Global UI Modals & Drawers
  const [toast, setToast] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [sendReminderModalInvoice, setSendReminderModalInvoice] = useState(null);
  const [recordPaymentModalInvoice, setRecordPaymentModalInvoice] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load persisted data if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('payme_saas_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.business) setBusiness(parsed.business);
        if (parsed.pricingPlans) setPricingPlans(parsed.pricingPlans);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.templates) setTemplates(parsed.templates);
        if (parsed.reminderJobs) setReminderJobs(parsed.reminderJobs);
      }
    } catch (e) {
      console.error('Failed to hydrate state', e);
    }
  }, []);

  // Save state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        'payme_saas_state_v1',
        JSON.stringify({
          business,
          pricingPlans,
          customers,
          invoices,
          payments,
          templates,
          reminderJobs,
        })
      );
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }, [business, pricingPlans, customers, invoices, payments, templates, reminderJobs]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3400 ? null : prev));
    }, 3500);
  };

  const resetDemoData = () => {
    localStorage.removeItem('payme_saas_state_v1');
    setBusiness(INITIAL_BUSINESS);
    setPricingPlans(INITIAL_PRICING_PLANS);
    setCustomers(INITIAL_CUSTOMERS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setTemplates(INITIAL_TEMPLATES);
    setReminderJobs(INITIAL_REMINDER_JOBS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Demo workspace reset to factory Indian SMB dataset.');
  };

  // ============================================================================
  // COMPUTED METRICS (REAL-TIME FROM INVOICES & PAYMENTS)
  // ============================================================================
  const metrics = useMemo(() => {
    const unpaidInvoices = invoices.filter(
      (inv) => inv.status !== 'Paid' && inv.status !== 'Draft' && inv.status !== 'Cancelled'
    );
    const totalOutstanding = unpaidInvoices.reduce((acc, inv) => acc + (inv.amountDue || 0), 0);

    const overdueInvoices = unpaidInvoices.filter(
      (inv) => inv.status === 'Overdue' || inv.status === 'Severely Overdue'
    );
    const totalOverdue = overdueInvoices.reduce((acc, inv) => acc + (inv.amountDue || 0), 0);

    const dueSoonInvoices = unpaidInvoices.filter(
      (inv) => inv.status === 'Due Today' || inv.status === 'Upcoming'
    );
    const totalDueSoon = dueSoonInvoices.reduce((acc, inv) => acc + (inv.amountDue || 0), 0);

    const collectedThisMonth = payments
      .filter((p) => p.status === 'Successful' && p.date.startsWith('2026-11'))
      .reduce((acc, p) => acc + (p.amount || 0), 0);

    return {
      totalOutstanding,
      totalOverdue,
      overdueCount: overdueInvoices.length,
      totalDueSoon,
      dueSoonCount: dueSoonInvoices.length,
      collectedThisMonth,
    };
  }, [invoices, payments]);

  const getCustomerById = (id) =>
    customers.find((c) => c.id === id) || {
      id: 'unknown',
      name: 'Customer',
      company: 'Unknown Company',
      email: 'billing@example.com',
      phone: '+91 90000 00000',
      whatsapp: '+91 90000 00000',
    };

  // ============================================================================
  // CORE BUSINESS ACTIONS (INVOICES, REMINDERS, PAYMENTS, RULES)
  // ============================================================================

  const handleLoginDemo = () => {
    setUser({
      id: 'usr_arjun',
      name: 'Arjun Deshmukh',
      email: 'arjun@apexindustrial.in',
      phone: '+91 98450 72190',
      role: 'Owner',
    });
    setViewMode('app');
    setActiveTab('dashboard');
    showToast('Welcome back, Arjun! Loaded Apex Industrial Supplies.');
  };

  const handleCreateCustomer = (newCust) => {
    const created = {
      id: `cust_${Date.now()}`,
      createdAt: TODAY_STR,
      optedOutWhatsapp: false,
      ...newCust,
    };
    setCustomers((prev) => [created, ...prev]);
    showToast(`Customer "${created.company || created.name}" added.`);
    return created;
  };

  const handleCreateInvoice = (invoiceData, isDraft = false) => {
    const status = isDraft
      ? 'Draft'
      : invoiceData.dueDate < TODAY_STR
      ? 'Overdue'
      : invoiceData.dueDate === TODAY_STR
      ? 'Due Today'
      : 'Upcoming';

    const newInv = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      amountPaid: 0,
      amountDue: invoiceData.total,
      status,
      lastReminderAt: isDraft ? 'Not scheduled' : 'Scheduled',
      timeline: [
        {
          id: `tl_${Date.now()}`,
          date: 'Nov 25, 2026 · Just now',
          text: isDraft
            ? `Draft ${invoiceData.invoiceNumber} saved`
            : `Invoice ${invoiceData.invoiceNumber} created & payment link generated`,
          type: 'created',
        },
      ],
    };

    setInvoices((prev) => [newInv, ...prev]);

    if (!isDraft) {
      const cust = getCustomerById(newInv.customerId);
      const enabledRules = business.reminderSchedule.filter((r) => r.enabled);
      const newJobs = enabledRules.map((rule, idx) => ({
        id: `rem_${Date.now()}_${idx}`,
        invoiceId: newInv.id,
        invoiceNumber: newInv.invoiceNumber,
        customerName: cust.company || cust.name,
        channel: rule.channel === 'whatsapp' ? 'WhatsApp' : 'Email',
        templateName:
          rule.offsetDays < 0
            ? 'Friendly Pre-Due Reminder'
            : rule.offsetDays === 0
            ? 'Due Today Notice'
            : rule.offsetDays >= 14
            ? 'Final Notice'
            : 'Overdue Follow-Up',
        scheduledAt: `${newInv.dueDate} 09:00 (${rule.label})`,
        status: 'Scheduled',
      }));
      setReminderJobs((prev) => [...newJobs, ...prev]);
      showToast(
        `Invoice ${newInv.invoiceNumber} created & ${newJobs.length} automated reminders scheduled!`
      );
    } else {
      showToast(`Draft ${newInv.invoiceNumber} saved.`);
    }

    setShowCreateInvoiceModal(false);
  };

  const handleSendReminder = (invoiceId, channel, customMessage) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;
    const cust = getCustomerById(inv.customerId);

    if (channel === 'WhatsApp' && cust.optedOutWhatsapp) {
      showToast(`${cust.company} has opted out of WhatsApp messages. Try Email instead.`, 'error');
      return;
    }

    const timestamp = 'Nov 25, 2026 · Just now';
    setInvoices((prev) =>
      prev.map((item) => {
        if (item.id !== invoiceId) return item;
        return {
          ...item,
          lastReminderAt: 'Just now',
          timeline: [
            {
              id: `tl_${Date.now()}`,
              date: timestamp,
              text: `${channel} reminder sent to ${
                channel === 'WhatsApp' ? cust.whatsapp : cust.email
              }: "${customMessage.slice(0, 68)}..."`,
              type: channel === 'WhatsApp' ? 'whatsapp' : 'email',
            },
            ...item.timeline,
          ],
        };
      })
    );

    setReminderJobs((prev) => [
      {
        id: `rem_${Date.now()}`,
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        customerName: cust.company || cust.name,
        channel,
        templateName: 'Manual / AI Follow-Up',
        scheduledAt: '2026-11-25 (Sent Now)',
        status: 'Delivered',
      },
      ...prev,
    ]);

    showToast(`${channel} payment reminder delivered to ${cust.company || cust.name}!`);
    setSendReminderModalInvoice(null);
  };

  const handleRecordPayment = (invoiceId, amount, method = 'UPI (Razorpay)') => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;
    const cust = getCustomerById(inv.customerId);
    const payAmount = Math.min(Number(amount) || 0, inv.amountDue);
    if (payAmount <= 0) return;

    const newAmountPaid = inv.amountPaid + payAmount;
    const newAmountDue = Math.max(0, inv.total - newAmountPaid);
    const isFullyPaid = newAmountDue === 0;
    const newStatus = isFullyPaid ? 'Paid' : 'Partially Paid';

    setInvoices((prev) =>
      prev.map((item) => {
        if (item.id !== invoiceId) return item;
        return {
          ...item,
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
          status: newStatus,
          timeline: [
            {
              id: `tl_${Date.now()}`,
              date: 'Nov 25, 2026 · Just now',
              text: isFullyPaid
                ? `Full payment of ${formatMoney(payAmount, item.currency)} received via ${method}. All future scheduled reminders cancelled.`
                : `Partial payment of ${formatMoney(payAmount, item.currency)} received via ${method}. Remaining balance: ${formatMoney(newAmountDue, item.currency)}`,
              type: 'paid',
            },
            ...item.timeline,
          ],
        };
      })
    );

    // Smart Rule: Cancel all future scheduled reminders when invoice is fully paid
    if (isFullyPaid) {
      setReminderJobs((prev) =>
        prev.map((job) =>
          job.invoiceId === invoiceId && job.status === 'Scheduled'
            ? { ...job, status: 'Cancelled' }
            : job
        )
      );
    }

    const newPayment = {
      id: `pay_${Date.now()}`,
      paymentRef: `PAY-${Math.floor(89000 + Math.random() * 9999)}`,
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      customerId: inv.customerId,
      customerName: cust.company || cust.name,
      amount: payAmount,
      currency: inv.currency,
      date: '2026-11-25 03:15',
      method,
      status: 'Successful',
    };

    setPayments((prev) => [newPayment, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        text: `${cust.company || cust.name} paid ${formatMoney(payAmount, inv.currency)} for ${inv.invoiceNumber}.`,
        time: 'Just now',
        type: 'success',
        unread: true,
      },
      ...prev,
    ]);

    showToast(
      isFullyPaid
        ? `${inv.invoiceNumber} marked Paid! Future reminders cancelled.`
        : `Partial payment of ${formatMoney(payAmount, inv.currency)} recorded.`
    );
    setRecordPaymentModalInvoice(null);
  };

  // ============================================================================
  // VIEW ROUTING
  // ============================================================================

  if (viewMode === 'public_pay') {
    const inv = invoices.find((i) => i.id === publicPayInvoiceId) || invoices[0];
    const cust = getCustomerById(inv.customerId);
    return (
      <PublicPaymentPortal
        invoice={inv}
        customer={cust}
        business={business}
        onBackToApp={() => setViewMode(user ? 'app' : 'landing')}
        onCompletePayment={(amount, method) => handleRecordPayment(inv.id, amount, method)}
      />
    );
  }

  if (viewMode === 'landing') {
    return (
      <LandingPage
        pricingPlans={pricingPlans}
        onStartFree={() => {
          setAuthSubView('signup');
          setViewMode('auth');
        }}
        onLogin={() => {
          setAuthSubView('login');
          setViewMode('auth');
        }}
        onLaunchDemo={handleLoginDemo}
        onOpenSamplePayLink={() => {
          setPublicPayInvoiceId('inv_1045');
          setViewMode('public_pay');
        }}
      />
    );
  }

  if (viewMode === 'auth') {
    return (
      <AuthFlow
        subView={authSubView}
        setSubView={setAuthSubView}
        onBackToLanding={() => setViewMode('landing')}
        onDemoLogin={handleLoginDemo}
        onCompleteAuth={(userData, isNewUser) => {
          setUser(userData);
          if (isNewUser) {
            setBusiness((prev) => ({
              ...prev,
              name: userData.businessName || prev.name,
              email: userData.email,
              phone: userData.phone || prev.phone,
            }));
            setViewMode('onboarding');
          } else {
            setViewMode('app');
            setActiveTab('dashboard');
          }
        }}
      />
    );
  }

  if (viewMode === 'onboarding') {
    return (
      <OnboardingWizard
        business={business}
        setBusiness={setBusiness}
        onCreateCustomer={handleCreateCustomer}
        onCreateInvoice={handleCreateInvoice}
        onFinish={() => {
          setViewMode('app');
          setActiveTab('dashboard');
          showToast("You're ready to start getting paid!");
        }}
      />
    );
  }

  // ============================================================================
  // AUTHENTICATED SAAS WORKSPACE SHELL
  // ============================================================================
  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: invoices.filter((i) => i.status === 'Overdue' || i.status === 'Severely Overdue').length },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reminders', label: 'Reminders', icon: Zap },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredGlobalResults = globalSearch.trim()
    ? {
        invoices: invoices.filter(
          (i) =>
            i.invoiceNumber.toLowerCase().includes(globalSearch.toLowerCase()) ||
            getCustomerById(i.customerId).company.toLowerCase().includes(globalSearch.toLowerCase())
        ),
        customers: customers.filter(
          (c) =>
            c.company.toLowerCase().includes(globalSearch.toLowerCase()) ||
            c.name.toLowerCase().includes(globalSearch.toLowerCase())
        ),
      }
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row font-sans antialiased">
      {/* TOAST BANNER */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fade-in">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200/80 z-30">
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <PayMeLogo onClick={() => setActiveTab('dashboard')} />
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {business.plan}
          </span>
        </div>

        <div className="px-4 py-3">
          <button
            onClick={() => setShowCreateInvoiceModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedInvoiceId(null);
                  setSelectedCustomerId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      active ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Platform Controls
            </p>
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" />
                Super Admin
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                SaaS
              </span>
            </button>
          </div>
        </nav>

        {/* Workspace Summary Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {business.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{business.name}</p>
              <p className="text-[11px] text-slate-500 truncate">
                {business.whatsappConnected ? '● WhatsApp API Active' : '○ WhatsApp Disconnected'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen pb-20 md:pb-0">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:hidden">
            <PayMeLogo size="sm" onClick={() => setActiveTab('dashboard')} />
          </div>

          {/* Global Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search invoice # or customer..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl text-sm outline-none transition-all"
            />
            {filteredGlobalResults && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Quick Results</span>
                  <button
                    onClick={() => setGlobalSearch('')}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Clear
                  </button>
                </div>
                {filteredGlobalResults.invoices.length === 0 &&
                filteredGlobalResults.customers.length === 0 ? (
                  <p className="text-sm text-slate-500 py-3 text-center">No matching records.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredGlobalResults.invoices.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setActiveTab('invoices');
                          setGlobalSearch('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{inv.invoiceNumber}</p>
                          <p className="text-xs text-slate-500">
                            {getCustomerById(inv.customerId).company}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatMoney(inv.amountDue || inv.total, inv.currency)}
                        </span>
                      </button>
                    ))}
                    {filteredGlobalResults.customers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCustomerId(c.id);
                          setActiveTab('customers');
                          setGlobalSearch('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{c.company}</p>
                          <p className="text-xs text-slate-500">{c.name}</p>
                        </div>
                        <span className="text-xs text-blue-600 font-medium">Customer →</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Quick Create */}
            <button
              onClick={() => setShowCreateInvoiceModal(true)}
              className="md:hidden p-2 rounded-xl bg-blue-600 text-white"
              title="Create Invoice"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">Notifications</span>
                    <button
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                      }
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 text-sm flex items-start gap-3 ${
                          n.unread ? 'bg-blue-50/40' : 'bg-white'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            n.type === 'success'
                              ? 'bg-emerald-500'
                              : n.type === 'danger'
                              ? 'bg-rose-500'
                              : n.type === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-slate-800 leading-snug">{n.text}</p>
                          <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Architecture & Docs Help Modal Trigger */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
              title="System Architecture, DB Schema & API Docs"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center">
                  {(user?.name || 'AD')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-none">
                    {user?.name || 'Arjun Deshmukh'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Owner</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Settings className="w-4 h-4 text-slate-400" /> Business Settings
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-500" /> Super Admin Panel
                  </button>
                  <button
                    onClick={() => {
                      setShowHelpModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Database className="w-4 h-4 text-slate-400" /> DB Schema & API Specs
                  </button>
                  <button
                    onClick={() => {
                      resetDemoData();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2.5"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-500" /> Reset Demo Data
                  </button>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setUser(null);
                        setViewMode('landing');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4" /> Log out to Landing Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE VIEWPORT */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              business={business}
              invoices={invoices}
              customers={customers}
              getCustomerById={getCustomerById}
              onCreateInvoice={() => setShowCreateInvoiceModal(true)}
              onViewInvoice={(id) => {
                setSelectedInvoiceId(id);
                setActiveTab('invoices');
              }}
              onSendReminder={(inv) => setSendReminderModalInvoice(inv)}
              onMarkPaid={(inv) => setRecordPaymentModalInvoice(inv)}
              onOpenPayLink={(id) => {
                setPublicPayInvoiceId(id);
                setViewMode('public_pay');
              }}
            />
          )}

          {activeTab === 'invoices' && !selectedInvoiceId && (
            <InvoicesListView
              invoices={invoices}
              getCustomerById={getCustomerById}
              onCreateInvoice={() => setShowCreateInvoiceModal(true)}
              onSelectInvoice={(id) => setSelectedInvoiceId(id)}
              onSendReminder={(inv) => setSendReminderModalInvoice(inv)}
              onMarkPaid={(inv) => setRecordPaymentModalInvoice(inv)}
              onOpenPayLink={(id) => {
                setPublicPayInvoiceId(id);
                setViewMode('public_pay');
              }}
            />
          )}

          {activeTab === 'invoices' && selectedInvoiceId && (
            <InvoiceDetailView
              invoice={invoices.find((i) => i.id === selectedInvoiceId) || invoices[0]}
              customer={getCustomerById(
                (invoices.find((i) => i.id === selectedInvoiceId) || invoices[0]).customerId
              )}
              business={business}
              onBack={() => setSelectedInvoiceId(null)}
              onSendReminder={(inv) => setSendReminderModalInvoice(inv)}
              onMarkPaid={(inv) => setRecordPaymentModalInvoice(inv)}
              onOpenPayLink={(id) => {
                setPublicPayInvoiceId(id);
                setViewMode('public_pay');
              }}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'customers' && !selectedCustomerId && (
            <CustomersView
              customers={customers}
              invoices={invoices}
              payments={payments}
              currency={business.currency}
              onAddCustomer={() => setShowAddCustomerModal(true)}
              onSelectCustomer={(id) => setSelectedCustomerId(id)}
            />
          )}

          {activeTab === 'customers' && selectedCustomerId && (
            <CustomerProfileView
              customer={getCustomerById(selectedCustomerId)}
              invoices={invoices.filter((i) => i.customerId === selectedCustomerId)}
              payments={payments.filter((p) => p.customerId === selectedCustomerId)}
              currency={business.currency}
              onBack={() => setSelectedCustomerId(null)}
              onCreateInvoice={() => setShowCreateInvoiceModal(true)}
              onViewInvoice={(invId) => {
                setSelectedInvoiceId(invId);
                setActiveTab('invoices');
              }}
              onSendReminder={(inv) => setSendReminderModalInvoice(inv)}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsView
              payments={payments}
              onViewInvoice={(invId) => {
                setSelectedInvoiceId(invId);
                setActiveTab('invoices');
              }}
            />
          )}

          {activeTab === 'reminders' && (
            <RemindersAndAIView
              reminderJobs={reminderJobs}
              setReminderJobs={setReminderJobs}
              templates={templates}
              setTemplates={setTemplates}
              invoices={invoices}
              business={business}
              getCustomerById={getCustomerById}
              onSendManualReminder={(invId, channel, msg) =>
                handleSendReminder(invId, channel, msg)
              }
              onShowToast={showToast}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              invoices={invoices}
              payments={payments}
              customers={customers}
              reminderJobs={reminderJobs}
              currency={business.currency}
              getCustomerById={getCustomerById}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              business={business}
              setBusiness={setBusiness}
              pricingPlans={pricingPlans}
              user={user}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'admin' && (
            <SuperAdminView
              pricingPlans={pricingPlans}
              setPricingPlans={setPricingPlans}
              invoices={invoices}
              payments={payments}
              reminderJobs={reminderJobs}
              business={business}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM TAB NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 flex items-center justify-around py-1.5 px-1">
        {[
          { id: 'dashboard', label: 'Home', icon: BarChart3 },
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'reminders', label: 'Reminders', icon: Zap },
          { id: 'settings', label: 'More', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedInvoiceId(null);
                setSelectedCustomerId(null);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] font-medium ${
                active ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* MODALS */}
      {showCreateInvoiceModal && (
        <CreateInvoiceModal
          customers={customers}
          business={business}
          nextNumber={`INV-${1045 + invoices.length}`}
          onClose={() => setShowCreateInvoiceModal(false)}
          onAddCustomer={handleCreateCustomer}
          onSubmit={handleCreateInvoice}
        />
      )}

      {showAddCustomerModal && (
        <AddCustomerModal
          onClose={() => setShowAddCustomerModal(false)}
          onSave={(c) => {
            handleCreateCustomer(c);
            setShowAddCustomerModal(false);
          }}
        />
      )}

      {sendReminderModalInvoice && (
        <SendReminderModal
          invoice={sendReminderModalInvoice}
          customer={getCustomerById(sendReminderModalInvoice.customerId)}
          business={business}
          templates={templates}
          onClose={() => setSendReminderModalInvoice(null)}
          onSend={handleSendReminder}
        />
      )}

      {recordPaymentModalInvoice && (
        <RecordPaymentModal
          invoice={recordPaymentModalInvoice}
          customer={getCustomerById(recordPaymentModalInvoice.customerId)}
          onClose={() => setRecordPaymentModalInvoice(null)}
          onConfirm={handleRecordPayment}
        />
      )}

      {showHelpModal && <ArchitectureDocsModal onClose={() => setShowHelpModal(false)} />}
    </div>
  );
}

// ============================================================================
// 4. PUBLIC MARKETING LANDING PAGE
// ============================================================================

function LandingPage({
  pricingPlans,
  onStartFree,
  onLogin,
  onLaunchDemo,
  onOpenSamplePayLink,
}) {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'What is PayMe?',
      a: 'PayMe is an automated accounts-receivable and payment follow-up platform built for SMBs. You add your invoices and due dates, and PayMe automatically sends polite, timely payment reminders with direct payment links via WhatsApp and email.',
    },
    {
      q: 'Does PayMe process payments?',
      a: 'PayMe generates clean, hosted payment pages for every invoice and connects modularly with leading payment gateways like Razorpay and Stripe so your customers can pay via UPI, NetBanking, or Cards—automatically marking your invoice as Paid.',
    },
    {
      q: 'Can I use WhatsApp?',
      a: 'Yes! PayMe integrates with the official WhatsApp Business Cloud API so reminders are sent reliably from a verified business channel with high open rates—never using risky browser automation or scraping.',
    },
    {
      q: 'Can I customize messages?',
      a: 'Completely. You can edit reminder schedules (e.g., 3 days before, on due date, 2/7/14 days overdue), customize message templates with dynamic invoice variables, or use our built-in AI Message Assistant.',
    },
    {
      q: 'Can customers see my PayMe dashboard?',
      a: 'No. Your workspace and receivables data remain strictly private. Customers only see a clean, trustworthy payment checkout page for their specific invoice.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. You can start on our Free plan with no credit card required, and upgrade, downgrade, or cancel your Pro or Business subscription anytime with one click.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <PayMeLogo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onLaunchDemo}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-blue-600" />
              Live Demo
            </button>
            <button
              onClick={onLogin}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2"
            >
              Login
            </button>
            <button
              onClick={onStartFree}
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/90 via-white to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Get Paid. Without the Chase.
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
              Stop Chasing Payments.{' '}
              <span className="text-blue-600">Start Getting Paid.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              PayMe automatically reminds your customers about pending invoices through WhatsApp
              and email, so you can spend less time following up and more time growing your
              business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onStartFree}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all text-base"
              >
                Start Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-7 py-3.5 rounded-xl border border-slate-200 transition-all text-base"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              No credit card required · Setup your first invoice in under 2 minutes
            </p>
          </div>

          {/* Interactive Dashboard Mockup */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/10 overflow-hidden">
              {/* Browser Top Bar */}
              <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-3 text-xs text-slate-400 font-mono">
                    app.payme.in/dashboard — Apex Industrial Supplies
                  </span>
                </div>
                <button
                  onClick={onLaunchDemo}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Open Interactive Workspace <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Mockup Metrics */}
              <div className="p-6 md:p-8 bg-[#F8FAFC]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Outstanding
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">₹4,82,500</p>
                    <p className="text-xs text-amber-600 font-medium mt-1.5">
                      4 open invoices tracked
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Collected This Month
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
                      ₹3,24,000
                    </p>
                    <p className="text-xs text-emerald-600 font-medium mt-1.5">
                      ↑ 12.4% from last month
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Overdue
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-rose-600 mt-1">₹1,18,500</p>
                    <p className="text-xs text-rose-600 font-medium mt-1.5">
                      Auto-reminders active
                    </p>
                  </div>
                </div>

                {/* Mockup Invoice Rows */}
                <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      Automated Follow-Up Queue
                    </span>
                    <button
                      onClick={onOpenSamplePayLink}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Preview Customer Payment Link →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {[
                      {
                        customer: 'ABC Restaurant',
                        inv: 'INV-1045',
                        amount: '₹48,500',
                        due: '7 days overdue',
                        status: 'Overdue',
                        channel: 'WhatsApp sent yesterday',
                      },
                      {
                        customer: 'Sharma Traders',
                        inv: 'INV-1046',
                        amount: '₹21,000',
                        due: 'Due in 3 days',
                        status: 'Due Today',
                        channel: 'Email scheduled today',
                      },
                      {
                        customer: 'Metro Distributors',
                        inv: 'INV-1047',
                        amount: '₹75,000',
                        due: 'Settled via UPI',
                        status: 'Paid',
                        channel: 'Future reminders cancelled',
                      },
                    ].map((row) => (
                      <div
                        key={row.inv}
                        className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
                            {row.inv}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{row.customer}</p>
                            <p className="text-xs text-slate-500">{row.channel}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-bold text-slate-900">{row.amount}</p>
                            <p className="text-xs text-slate-500">{row.due}</p>
                          </div>
                          <StatusBadge status={row.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              The Receivables Bottleneck
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Late payments shouldn&apos;t become your daily job.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Manual follow-ups',
                desc: 'Stop repeatedly calling and messaging customers on WhatsApp just to ask for status updates.',
                icon: Smartphone,
              },
              {
                title: 'Forgotten invoices',
                desc: 'Never lose track of an unpaid invoice buried inside spreadsheets or paper ledgers.',
                icon: FileText,
              },
              {
                title: 'Awkward conversations',
                desc: 'Preserve strong customer relationships—let PayMe send polite, consistent reminders on your behalf.',
                icon: MessageSquare,
              },
              {
                title: 'Unpredictable cash flow',
                desc: 'Know exactly how much money is outstanding, what is overdue, and when cash is arriving.',
                icon: TrendingUp,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:border-slate-300 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 mb-4 shadow-sm">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-[#0F172A]">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (4-Step Flow) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Simple Core Loop
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
              Invoice → Reminder → Payment → Done
            </h2>
            <p className="mt-3 text-slate-400 text-base">
              Your invoices chase customers automatically from creation to settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Add Invoice',
                desc: 'Enter customer details, invoice amount and due date in seconds.',
              },
              {
                step: '02',
                title: 'PayMe Takes Over',
                desc: 'PayMe generates a unique payment link and schedules smart reminders.',
              },
              {
                step: '03',
                title: 'Customer Gets Reminders',
                desc: 'Customers receive polite, branded reminders via WhatsApp and email.',
              },
              {
                step: '04',
                title: 'You Get Paid',
                desc: 'Customer pays online or via transfer—PayMe updates your dashboard and cancels future nudges.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 relative"
              >
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  STEP {s.step}
                </span>
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Everything You Need to Collect Faster
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Built for payment recovery, not accounting bloat
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Automated Payment Reminders',
                desc: 'Automatically send reminders before, on, and after the due date without lifting a finger.',
                icon: Clock,
              },
              {
                title: 'WhatsApp Reminders',
                desc: 'Send official WhatsApp Business reminders where customers actually read and reply.',
                icon: MessageSquare,
              },
              {
                title: 'Email Reminders',
                desc: 'Dispatch clean, itemized email reminders with one-click payment buttons.',
                icon: Mail,
              },
              {
                title: 'Payment Links',
                desc: 'Generate a unique, mobile-friendly checkout link for every single invoice.',
                icon: CreditCard,
              },
              {
                title: 'Invoice Tracking',
                desc: 'Know immediately which invoices are Upcoming, Due Today, Partially Paid, or Overdue.',
                icon: CheckCircle2,
              },
              {
                title: 'Customer Management',
                desc: 'Maintain a clean directory with total invoiced, paid history, and contact preferences.',
                icon: Users,
              },
              {
                title: 'Payment Dashboard',
                desc: 'See total outstanding, overdue amounts, and monthly collections at a glance.',
                icon: BarChart3,
              },
              {
                title: 'Smart Follow-ups',
                desc: 'Automatically escalate frequency when overdue and cancel reminders the moment payment lands.',
                icon: Zap,
              },
              {
                title: 'Reminder Templates & Activity Timeline',
                desc: 'Customize templates and inspect a complete timestamped audit trail for every invoice.',
                icon: Layers,
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl border border-slate-200/80 bg-white hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#0F172A]">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Trust Section (No fake logos or testimonials) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
            Built for businesses that need their cash flow to move faster.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Designed specifically for Indian B2B workflows with GSTIN & INR support, ready for global multi-currency expansion.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              'Wholesale',
              'Distribution',
              'Manufacturing',
              'Agencies',
              'B2B Services',
              'Hardware & Electrical Suppliers',
              'Printing & Packaging',
              'Restaurant Suppliers',
            ].map((ind) => (
              <span
                key={ind}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Live synced with Super Admin Panel!) */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Transparent SaaS Pricing
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Simple plans that pay for themselves with one recovered invoice
            </h2>
            <p className="mt-3 text-sm font-medium text-emerald-700 bg-emerald-50 inline-block px-3.5 py-1 rounded-full border border-emerald-200">
              No credit card required to start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all ${
                  plan.highlighted
                    ? 'bg-[#0F172A] text-white shadow-2xl ring-2 ring-blue-600 scale-[1.02]'
                    : 'bg-white text-[#0F172A] border border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {plan.highlighted && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      plan.highlighted ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">
                      ₹{plan.priceINR.toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      /month
                    </span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            plan.highlighted ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onStartFree}
                  className={`mt-8 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-slate-200/70">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div
                key={item.q}
                className="bg-white rounded-xl border border-slate-200/80 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between font-semibold text-slate-900"
                >
                  <span>{item.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PayMeLogo size="sm" />
            <span className="text-xs text-slate-500">
              — Stop chasing payments. Let PayMe do it for you.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <button onClick={onLaunchDemo} className="hover:text-slate-900 font-medium">
              Live Demo Workspace
            </button>
            <button onClick={onOpenSamplePayLink} className="hover:text-slate-900 font-medium">
              Sample Payment Link
            </button>
            <span>© 2026 PayMe Technologies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// 5. AUTHENTICATION & 4-STEP ONBOARDING WIZARD
// ============================================================================

function AuthFlow({ subView, setSubView, onBackToLanding, onDemoLogin, onCompleteAuth }) {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('arjun@apexindustrial.in');
  const [phone, setPhone] = useState('+91 98450 72190');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subView === 'forgot') {
      setStatusMsg('Password reset link sent to your email! Click below to set a new password.');
      return;
    }
    if (subView === 'reset') {
      setStatusMsg('Password updated successfully. You can now log in.');
      setSubView('login');
      return;
    }
    if (subView === 'signup') {
      onCompleteAuth(
        {
          id: `usr_${Date.now()}`,
          name: fullName || 'New Business Owner',
          businessName: businessName || 'My Enterprise',
          email,
          phone,
          role: 'Owner',
        },
        true
      );
    } else {
      onCompleteAuth(
        {
          id: 'usr_arjun',
          name: 'Arjun Deshmukh',
          email,
          phone,
          role: 'Owner',
        },
        false
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <PayMeLogo onClick={onBackToLanding} />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[#0F172A]">
          {subView === 'signup' && 'Create your PayMe account'}
          {subView === 'login' && 'Sign in to your workspace'}
          {subView === 'forgot' && 'Reset your password'}
          {subView === 'reset' && 'Choose a new password'}
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          {subView === 'signup'
            ? 'Start recovering unpaid invoices in under 2 minutes.'
            : 'Get Paid. Without the Chase.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-900/5 border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Instant Demo Shortcut */}
          <button
            type="button"
            onClick={onDemoLogin}
            className="w-full mb-6 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-sm font-semibold transition-colors"
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            One-Click Demo Login (Apex Industrial Supplies)
          </button>

          {statusMsg && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800">
              {statusMsg}
              {subView === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusMsg('');
                    setSubView('reset');
                  }}
                  className="block mt-1 font-bold underline"
                >
                  Simulate Clicking Reset Link →
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {subView === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rohan Mehta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Mehta Packaging Pvt Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 outline-none"
                  />
                </div>
              </>
            )}

            {subView !== 'reset' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 outline-none"
                />
              </div>
            )}

            {subView === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (WhatsApp enabled)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 outline-none"
                />
              </div>
            )}

            {subView !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {subView === 'reset' ? 'New Password' : 'Password'}
                  </label>
                  {subView === 'login' && (
                    <button
                      type="button"
                      onClick={() => setSubView('forgot')}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 outline-none"
                />
              </div>
            )}

            {subView === 'login' && (
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                Remember me for 30 days
              </label>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              {subView === 'signup' && 'Continue to Business Setup →'}
              {subView === 'login' && 'Sign In'}
              {subView === 'forgot' && 'Send Reset Instructions'}
              {subView === 'reset' && 'Update Password'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            {subView === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setSubView('signup')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Start Free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setSubView('login')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingWizard({
  business,
  setBusiness,
  onCreateCustomer,
  onCreateInvoice,
  onFinish,
}) {
  const [step, setStep] = useState(1);
  const [bizName, setBizName] = useState(business.name);
  const [bizType, setBizType] = useState(business.type);
  const [address, setAddress] = useState(business.address);
  const [gstin, setGstin] = useState(business.gstin);
  const [website, setWebsite] = useState(business.website);
  const [currency, setCurrency] = useState(business.currency || 'INR');

  // Step 4 quick first invoice
  const [custName, setCustName] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [custPhone, setCustPhone] = useState('+91 ');
  const [invAmount, setInvAmount] = useState('25000');
  const [invDue, setInvDue] = useState('2026-12-05');

  const handleSaveStep1 = (e) => {
    e.preventDefault();
    setBusiness((prev) => ({
      ...prev,
      name: bizName,
      type: bizType,
      address,
      gstin,
      website,
    }));
    setStep(2);
  };

  const handleCreateFirstAndFinish = (e) => {
    e.preventDefault();
    if (custCompany.trim() || custName.trim()) {
      const createdCust = onCreateCustomer({
        name: custName || custCompany,
        company: custCompany || custName,
        phone: custPhone,
        whatsapp: custPhone,
        email: 'billing@customer.in',
        address: 'India',
      });
      const amt = Number(invAmount) || 25000;
      onCreateInvoice(
        {
          invoiceNumber: 'INV-1051',
          customerId: createdCust.id,
          invoiceDate: TODAY_STR,
          dueDate: invDue,
          currency,
          items: [
            {
              id: `li_${Date.now()}`,
              description: 'Initial Supply / Service Order',
              quantity: 1,
              rate: amt,
              tax: 0,
            },
          ],
          subtotal: amt,
          taxTotal: 0,
          total: amt,
          notes: 'Created during PayMe quick onboarding.',
          paymentInstructions: 'Pay online via PayMe payment link.',
        },
        false
      );
    }
    onFinish();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <PayMeLogo />
          <span className="text-xs font-semibold text-slate-500">Step {step} of 4</span>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
          {step === 1 && (
            <form onSubmit={handleSaveStep1} className="space-y-4">
              <h2 className="text-xl font-bold text-[#0F172A]">Tell us about your business</h2>
              <p className="text-sm text-slate-500">
                This appears on your invoices and customer payment pages.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Type
                </label>
                <select
                  value={bizType}
                  onChange={(e) => setBizType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option>Wholesale & Distribution</option>
                  <option>Manufacturing</option>
                  <option>B2B Agency / Services</option>
                  <option>Hardware & Electrical Supplier</option>
                  <option>Printing & Packaging</option>
                  <option>Restaurant & FMCG Supplier</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="29AABCA4821M1Z5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website (Optional)
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
              >
                Continue to Currency →
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#0F172A]">Select primary currency</h2>
              <p className="text-sm text-slate-500">
                INR (₹) is selected by default for Indian businesses. You can also invoice international clients in USD, GBP, or EUR.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(CURRENCIES).map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      currency === c.code
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl font-bold text-slate-900">{c.symbol}</span>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{c.code}</p>
                    <p className="text-xs text-slate-500">{c.name}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-slate-600"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBusiness((prev) => ({ ...prev, currency }));
                    setStep(3);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
                >
                  Continue to Reminders →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Default Reminder Automation Schedule
              </h2>
              <p className="text-sm text-slate-500">
                PayMe automatically follows this proven cadence for every new invoice. You can customize this anytime in Settings.
              </p>
              <div className="space-y-2.5">
                {business.reminderSchedule.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-slate-800">{item.label}</span>
                    </div>
                    <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                      {item.channel}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm font-medium text-slate-600"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleCreateFirstAndFinish} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                You&apos;re ready to start getting paid.
              </div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                Add your first customer & invoice (Optional)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Company
                  </label>
                  <input
                    type="text"
                    value={custCompany}
                    onChange={(e) => setCustCompany(e.target.value)}
                    placeholder="e.g. Royal Foods"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Invoice Amount ({CURRENCIES[currency]?.symbol})
                  </label>
                  <input
                    type="number"
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invDue}
                    onChange={(e) => setInvDue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 gap-3">
                <button
                  type="button"
                  onClick={onFinish}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Skip to Dashboard
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm"
                >
                  Launch Workspace →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN DASHBOARD VIEW
// ============================================================================

function DashboardView({
  metrics,
  business,
  invoices,
  getCustomerById,
  onCreateInvoice,
  onViewInvoice,
  onSendReminder,
  onMarkPaid,
  onOpenPayLink,
}) {
  const [timeframe, setTimeframe] = useState('30d');

  const chartDatasets = {
    '7d': [
      { label: 'Mon', collected: 42000, outstanding: 510000, overdue: 135000 },
      { label: 'Tue', collected: 28000, outstanding: 495000, overdue: 135000 },
      { label: 'Wed', collected: 65000, outstanding: 482500, overdue: 118500 },
      { label: 'Thu', collected: 19000, outstanding: 482500, overdue: 118500 },
      { label: 'Fri', collected: 88000, outstanding: 482500, overdue: 118500 },
      { label: 'Sat', collected: 52000, outstanding: 482500, overdue: 118500 },
      { label: 'Today', collected: 30000, outstanding: metrics.totalOutstanding, overdue: metrics.totalOverdue },
    ],
    '30d': [
      { label: 'Wk 1', collected: 87000, outstanding: 540000, overdue: 162000 },
      { label: 'Wk 2', collected: 112000, outstanding: 515000, overdue: 140000 },
      { label: 'Wk 3', collected: 75000, outstanding: 498000, overdue: 125000 },
      { label: 'Current', collected: metrics.collectedThisMonth, outstanding: metrics.totalOutstanding, overdue: metrics.totalOverdue },
    ],
    '3m': [
      { label: 'Sep', collected: 268000, outstanding: 410000, overdue: 95000 },
      { label: 'Oct', collected: 288000, outstanding: 452000, overdue: 132000 },
      { label: 'Nov', collected: metrics.collectedThisMonth, outstanding: metrics.totalOutstanding, overdue: metrics.totalOverdue },
    ],
    '6m': [
      { label: 'Jun', collected: 210000, outstanding: 390000, overdue: 110000 },
      { label: 'Jul', collected: 235000, outstanding: 405000, overdue: 102000 },
      { label: 'Aug', collected: 254000, outstanding: 420000, overdue: 98000 },
      { label: 'Sep', collected: 268000, outstanding: 410000, overdue: 95000 },
      { label: 'Oct', collected: 288000, outstanding: 452000, overdue: 132000 },
      { label: 'Nov', collected: metrics.collectedThisMonth, outstanding: metrics.totalOutstanding, overdue: metrics.totalOverdue },
    ],
    '12m': [
      { label: 'Q1', collected: 640000, outstanding: 380000, overdue: 92000 },
      { label: 'Q2', collected: 725000, outstanding: 415000, overdue: 108000 },
      { label: 'Q3', collected: 790000, outstanding: 430000, overdue: 112000 },
      { label: 'Q4', collected: 612000 + metrics.collectedThisMonth, outstanding: metrics.totalOutstanding, overdue: metrics.totalOverdue },
    ],
  };

  const activeSeries = chartDatasets[timeframe];
  const maxVal = Math.max(
    ...activeSeries.flatMap((d) => [d.collected, d.outstanding, d.overdue]),
    100000
  );

  // Prioritize actionable unpaid invoices first
  const actionableInvoices = [...invoices].sort((a, b) => {
    const rank = {
      'Severely Overdue': 1,
      Overdue: 2,
      'Due Today': 3,
      'Partially Paid': 4,
      Upcoming: 5,
      Paid: 6,
      Draft: 7,
    };
    return (rank[a.status] || 9) - (rank[b.status] || 9);
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Receivables Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track who owes you, upcoming due dates, and automated WhatsApp & email follow-ups.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onCreateInvoice}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Outstanding
            </span>
            <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-3">
            {formatMoney(metrics.totalOutstanding, business.currency)}
          </p>
          <p className="text-xs font-medium text-slate-500 mt-2">
            Across {invoices.filter((i) => i.amountDue > 0).length} unpaid invoices
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              Overdue
            </span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-600 mt-3">
            {formatMoney(metrics.totalOverdue, business.currency)}
          </p>
          <p className="text-xs font-medium text-rose-700 mt-2">
            {metrics.overdueCount} invoices past due date
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Due Soon
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-3">
            {formatMoney(metrics.totalDueSoon, business.currency)}
          </p>
          <p className="text-xs font-medium text-amber-700 mt-2">
            {metrics.dueSoonCount} invoices due within 7 days
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Collected This Month
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-3">
            {formatMoney(metrics.collectedThisMonth, business.currency)}
          </p>
          <p className="text-xs font-semibold text-emerald-700 mt-2">
            ↑ 12.4% from last month
          </p>
        </div>
      </div>

      {/* Collections Overview Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Collections Overview</h2>
            <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Money Collected
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Money Outstanding
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Money Overdue
              </span>
            </div>
          </div>

          <div className="inline-flex bg-slate-100 p-1 rounded-xl self-start">
            {[
              { id: '7d', label: '7 days' },
              { id: '30d', label: '30 days' },
              { id: '3m', label: '3 months' },
              { id: '6m', label: '6 months' },
              { id: '12m', label: '12 months' },
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeframe === tf.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Bar Chart */}
        <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2 border-b border-slate-100">
          {activeSeries.map((pt) => {
            const hColl = Math.max(8, Math.round((pt.collected / maxVal) * 165));
            const hOut = Math.max(8, Math.round((pt.outstanding / maxVal) * 165));
            const hOver = Math.max(8, Math.round((pt.overdue / maxVal) * 165));
            return (
              <div key={pt.label} className="flex-1 flex flex-col items-center group">
                <div className="flex items-end gap-1 sm:gap-2 h-44">
                  <div
                    style={{ height: `${hColl}px` }}
                    title={`Collected: ${formatMoney(pt.collected, business.currency)}`}
                    className="w-3 sm:w-5 bg-emerald-500 rounded-t-md transition-all duration-300 hover:opacity-85"
                  />
                  <div
                    style={{ height: `${hOut}px` }}
                    title={`Outstanding: ${formatMoney(pt.outstanding, business.currency)}`}
                    className="w-3 sm:w-5 bg-blue-500 rounded-t-md transition-all duration-300 hover:opacity-85"
                  />
                  <div
                    style={{ height: `${hOver}px` }}
                    title={`Overdue: ${formatMoney(pt.overdue, business.currency)}`}
                    className="w-3 sm:w-5 bg-rose-500 rounded-t-md transition-all duration-300 hover:opacity-85"
                  />
                </div>
                <span className="mt-2.5 text-xs font-medium text-slate-500">{pt.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outstanding & Actionable Invoices Table / Mobile Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              Actionable & Outstanding Invoices
            </h2>
            <p className="text-xs text-slate-500">
              Prioritized by urgency so you know who to follow up with next.
            </p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/60">
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-4">Amount Due</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Reminder</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {actionableInvoices.map((inv) => {
                const cust = getCustomerById(inv.customerId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-slate-900">{cust.company}</p>
                      <p className="text-xs text-slate-500">{cust.name}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatMoney(inv.amountDue > 0 ? inv.amountDue : inv.total, inv.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{inv.dueDate}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{inv.lastReminderAt}</td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {inv.status !== 'Paid' && (
                          <>
                            <button
                              onClick={() => onSendReminder(inv)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                            >
                              Remind
                            </button>
                            <button
                              onClick={() => onMarkPaid(inv)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors"
                            >
                              Mark Paid
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onViewInvoice(inv.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {actionableInvoices.map((inv) => {
            const cust = getCustomerById(inv.customerId);
            return (
              <div key={inv.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-blue-600">
                      {inv.invoiceNumber}
                    </span>
                    <h3 className="font-bold text-slate-900">{cust.company}</h3>
                    <p className="text-xs text-slate-500">Due: {inv.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-slate-900">
                      {formatMoney(inv.amountDue > 0 ? inv.amountDue : inv.total, inv.currency)}
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={inv.status} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {inv.status !== 'Paid' && (
                    <>
                      <button
                        onClick={() => onSendReminder(inv)}
                        className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                      >
                        Send Reminder
                      </button>
                      <button
                        onClick={() => onMarkPaid(inv)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                      >
                        Mark Paid
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onViewInvoice(inv.id)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. INVOICES LIST & INVOICE DETAIL VIEW
// ============================================================================

function InvoicesListView({
  invoices,
  getCustomerById,
  onCreateInvoice,
  onSelectInvoice,
  onSendReminder,
  onMarkPaid,
  onOpenPayLink,
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const tabs = ['All', 'Draft', 'Upcoming', 'Due Today', 'Overdue', 'Partially Paid', 'Paid'];

  const filtered = useMemo(() => {
    return invoices
      .filter((inv) => {
        if (filterStatus === 'Overdue') {
          if (inv.status !== 'Overdue' && inv.status !== 'Severely Overdue') return false;
        } else if (filterStatus !== 'All' && inv.status !== filterStatus) {
          return false;
        }

        if (searchQuery.trim()) {
          const cust = getCustomerById(inv.customerId);
          const q = searchQuery.toLowerCase();
          return (
            inv.invoiceNumber.toLowerCase().includes(q) ||
            cust.company.toLowerCase().includes(q) ||
            cust.name.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return b.total - a.total;
        if (sortBy === 'due_date') return a.dueDate.localeCompare(b.dueDate);
        if (sortBy === 'oldest') return a.invoiceDate.localeCompare(b.invoiceDate);
        return b.invoiceDate.localeCompare(a.invoiceDate);
      });
  }, [invoices, filterStatus, searchQuery, sortBy, getCustomerById]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Invoices</h1>
          <p className="text-sm text-slate-500">
            Create invoices, share payment links, and monitor automated reminder schedules.
          </p>
        </div>
        <button
          onClick={onCreateInvoice}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer or invoice number..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 font-medium"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="highest">Sort: Highest Amount</option>
            <option value="due_date">Sort: Due Date</option>
          </select>
        </div>
      </div>

      {/* Empty State or Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No invoices match this filter</h3>
          <p className="text-sm text-slate-500 mt-1">
            Your first invoice is only a few clicks away.
          </p>
          <button
            onClick={onCreateInvoice}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/60">
                  <th className="py-3 px-6">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Issued</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Total / Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((inv) => {
                  const cust = getCustomerById(inv.customerId);
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => onSelectInvoice(inv.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-6 font-mono text-xs font-bold text-blue-600">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{cust.company}</p>
                        <p className="text-xs text-slate-500">{cust.phone}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{inv.invoiceDate}</td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {inv.dueDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">
                          {formatMoney(inv.total, inv.currency)}
                        </p>
                        {inv.amountDue > 0 && inv.amountDue < inv.total && (
                          <p className="text-[11px] text-indigo-600 font-medium">
                            Due: {formatMoney(inv.amountDue, inv.currency)}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td
                        className="py-3.5 px-6 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onOpenPayLink(inv.id)}
                            title="Open Customer Payment Link"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          {inv.status !== 'Paid' && (
                            <>
                              <button
                                onClick={() => onSendReminder(inv)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold"
                              >
                                Remind
                              </button>
                              <button
                                onClick={() => onMarkPaid(inv)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold"
                              >
                                Paid
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceDetailView({
  invoice,
  customer,
  business,
  onBack,
  onSendReminder,
  onMarkPaid,
  onOpenPayLink,
  onShowToast,
}) {
  const payUrl = `https://payme.in/pay/${invoice.invoiceNumber.toLowerCase()}`;

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(payUrl).catch(() => {});
    }
    onShowToast(`Payment link copied: ${payUrl}`);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to Invoices
      </button>

      {/* Top Action Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0F172A]">{invoice.invoiceNumber}</h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Billed to <span className="font-semibold text-slate-800">{customer.company}</span> (
            {customer.name}) · Due {invoice.dueDate}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {invoice.status !== 'Paid' && (
            <>
              <button
                onClick={() => onSendReminder(invoice)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm"
              >
                <Send className="w-4 h-4" />
                Send Reminder
              </button>
              <button
                onClick={() => onMarkPaid(invoice)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Paid
              </button>
            </>
          )}
          <button
            onClick={() => onOpenPayLink(invoice.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-semibold"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
            Open Payment Page
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            PDF / Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Professional Invoice Sheet */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">From</p>
              <p className="font-bold text-lg text-slate-900 mt-1">{business.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xs">{business.address}</p>
              {business.gstin && (
                <p className="text-xs font-mono text-slate-600 mt-1">GSTIN: {business.gstin}</p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Bill To</p>
              <p className="font-bold text-lg text-slate-900 mt-1">{customer.company}</p>
              <p className="text-xs text-slate-600">{customer.name}</p>
              <p className="text-xs text-slate-500">{customer.email}</p>
              <p className="text-xs text-slate-500">{customer.phone}</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 text-right">Qty</th>
                  <th className="py-2.5 text-right">Rate</th>
                  <th className="py-2.5 text-right">Tax</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item) => {
                  const lineTotal = item.quantity * item.rate * (1 + (item.tax || 0) / 100);
                  return (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-slate-800">{item.description}</td>
                      <td className="py-3 text-right text-slate-600">{item.quantity}</td>
                      <td className="py-3 text-right text-slate-600">
                        {formatMoney(item.rate, invoice.currency)}
                      </td>
                      <td className="py-3 text-right text-slate-500">{item.tax}%</td>
                      <td className="py-3 text-right font-semibold text-slate-900">
                        {formatMoney(lineTotal, invoice.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Box */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <div className="w-full sm:w-64 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatMoney(invoice.subtotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (GST)</span>
                <span>{formatMoney(invoice.taxTotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-200">
                <span>Invoice Total</span>
                <span>{formatMoney(invoice.total, invoice.currency)}</span>
              </div>
              {invoice.amountPaid > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Amount Paid</span>
                  <span>- {formatMoney(invoice.amountPaid, invoice.currency)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-lg text-blue-600 pt-1">
                <span>Balance Due</span>
                <span>{formatMoney(invoice.amountDue, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {/* Hosted Payment Link Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">Customer Payment Link</p>
              <p className="text-sm font-mono text-blue-600 truncate">{payUrl}</p>
            </div>
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 shrink-0"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </button>
          </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-base text-[#0F172A] mb-4">Activity Timeline</h3>
          <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {invoice.timeline.map((ev) => (
              <div key={ev.id} className="relative pl-8">
                <span
                  className={`absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                    ev.type === 'whatsapp'
                      ? 'bg-emerald-500'
                      : ev.type === 'email'
                      ? 'bg-blue-500'
                      : ev.type === 'paid'
                      ? 'bg-emerald-600'
                      : ev.type === 'alert'
                      ? 'bg-rose-500'
                      : 'bg-slate-700'
                  }`}
                >
                  •
                </span>
                <p className="text-xs font-semibold text-slate-400">{ev.date}</p>
                <p className="text-sm text-slate-800 mt-0.5 leading-snug">{ev.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. CUSTOMER-FACING PUBLIC PAYMENT LINK PAGE
// ============================================================================

function PublicPaymentPortal({ invoice, customer, business, onBackToApp, onCompletePayment }) {
  const [selectedMethod, setSelectedMethod] = useState('UPI / QR');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(invoice.status === 'Paid');

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onCompletePayment(invoice.amountDue, `${selectedMethod} (${business.paymentProvider})`);
      setIsProcessing(false);
      setPaidSuccess(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-8 px-4">
      <div className="max-w-lg w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900">
              PAYME <span className="text-slate-400 font-normal">Verified Checkout</span>
            </span>
          </div>
          <button
            onClick={onBackToApp}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            ← Back to Business App
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-[#0F172A] text-white p-6 sm:p-8">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Payment Request From
            </p>
            <h1 className="text-xl font-bold mt-1">{business.name}</h1>
            <div className="mt-6 flex items-baseline justify-between border-t border-slate-800 pt-5">
              <div>
                <p className="text-xs text-slate-400">Invoice #{invoice.invoiceNumber}</p>
                <p className="text-sm font-medium text-slate-200 mt-0.5">{customer.company}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Amount Due</p>
                <p className="text-3xl font-extrabold text-white">
                  {formatMoney(paidSuccess ? 0 : invoice.amountDue, invoice.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between text-sm py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Due Date</span>
              <span className="font-semibold text-slate-900">{invoice.dueDate}</span>
            </div>

            {/* Line Items Summary */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Invoice Summary
              </p>
              <div className="space-y-2 text-sm">
                {invoice.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-slate-700">
                    <span className="truncate pr-4">
                      {it.description} × {it.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatMoney(it.quantity * it.rate * (1 + (it.tax || 0) / 100), invoice.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {paidSuccess || invoice.status === 'Paid' ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">Payment Received!</h3>
                <p className="text-xs text-emerald-700">
                  Invoice {invoice.invoiceNumber} is settled in full. A receipt has been logged for {customer.company}.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                    Select Payment Method
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'UPI / QR', icon: QrCode },
                      { id: 'NetBanking', icon: Landmark },
                      { id: 'Card', icon: CreditCard },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMethod(m.id)}
                          className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                            selectedMethod === m.id
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {m.id}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayNow}
                  className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Processing Secure Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Pay{' '}
                      {formatMoney(invoice.amountDue, invoice.currency)}
                    </>
                  )}
                </button>
              </>
            )}

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Need help? Contact <span className="font-semibold text-slate-700">{business.name}</span> at{' '}
                {business.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. CUSTOMERS & CUSTOMER PROFILE VIEW
// ============================================================================

function CustomersView({
  customers,
  invoices,
  payments,
  currency,
  onAddCustomer,
  onSelectCustomer,
}) {
  const [search, setSearch] = useState('');

  const enriched = customers
    .filter(
      (c) =>
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    )
    .map((c) => {
      const custInvoices = invoices.filter((i) => i.customerId === c.id);
      const outstanding = custInvoices.reduce((s, i) => s + (i.amountDue || 0), 0);
      const paid = custInvoices.reduce((s, i) => s + (i.amountPaid || 0), 0);
      const hasOverdue = custInvoices.some(
        (i) => i.status === 'Overdue' || i.status === 'Severely Overdue'
      );
      const custPayments = payments.filter((p) => p.customerId === c.id && p.status === 'Successful');
      return {
        ...c,
        outstanding,
        paid,
        lastPayment: custPayments[0]?.date?.split(' ')[0] || '—',
        status: hasOverdue ? 'Overdue' : outstanding > 0 ? 'Upcoming' : 'Paid',
      };
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Customers</h1>
          <p className="text-sm text-slate-500">
            Manage customer WhatsApp & email contacts and track outstanding balances.
          </p>
        </div>
        <button
          onClick={onAddCustomer}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact name, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/60">
                <th className="py-3 px-6">Company / Contact</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Outstanding</th>
                <th className="py-3 px-4">Total Paid</th>
                <th className="py-3 px-4">Last Payment</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {enriched.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectCustomer(c.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">{c.company}</p>
                    <p className="text-xs text-slate-500">{c.name}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-700">{c.whatsapp}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{c.email}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatMoney(c.outstanding, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 font-semibold">
                    {formatMoney(c.paid, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{c.lastPayment}</td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CustomerProfileView({
  customer,
  invoices,
  payments,
  currency,
  onBack,
  onCreateInvoice,
  onViewInvoice,
  onSendReminder,
}) {
  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = invoices.reduce((s, i) => s + i.amountDue, 0);
  const overdue = invoices
    .filter((i) => i.status === 'Overdue' || i.status === 'Severely Overdue')
    .reduce((s, i) => s + i.amountDue, 0);

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to Customers
      </button>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">{customer.company}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {customer.name} · {customer.whatsapp} · {customer.email}
          </p>
        </div>
        <button
          onClick={onCreateInvoice}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl"
        >
          <Plus className="w-4 h-4" /> Create Invoice for Customer
        </button>
      </div>

      {/* Customer KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
          <p className="text-xs text-slate-500 font-semibold">Total Invoiced</p>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatMoney(totalInvoiced, currency)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
          <p className="text-xs text-emerald-700 font-semibold">Total Paid</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {formatMoney(totalPaid, currency)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
          <p className="text-xs text-slate-500 font-semibold">Outstanding</p>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatMoney(outstanding, currency)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
          <p className="text-xs text-rose-600 font-semibold">Overdue</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{formatMoney(overdue, currency)}</p>
        </div>
      </div>

      {/* Customer Invoices */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-900">
          Invoices ({invoices.length})
        </div>
        <div className="divide-y divide-slate-100">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <button
                  onClick={() => onViewInvoice(inv.id)}
                  className="font-mono text-sm font-bold text-blue-600 hover:underline"
                >
                  {inv.invoiceNumber}
                </button>
                <p className="text-xs text-slate-500">
                  Issued {inv.invoiceDate} · Due {inv.dueDate}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm">
                  {formatMoney(inv.amountDue || inv.total, inv.currency)}
                </span>
                <StatusBadge status={inv.status} />
                {inv.status !== 'Paid' && (
                  <button
                    onClick={() => onSendReminder(inv)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold"
                  >
                    Remind
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. PAYMENTS LEDGER VIEW
// ============================================================================

function PaymentsView({ payments, onViewInvoice }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = payments.filter((p) => {
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.paymentRef.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.invoiceNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Payments</h1>
        <p className="text-sm text-slate-500">
          Real-time payment webhook log across UPI, NetBanking, Cards, and manual bank transfers.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'Successful', 'Pending', 'Failed', 'Refunded'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment ID or customer..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/60">
                <th className="py-3 px-6">Payment ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-6 font-mono text-xs font-semibold text-slate-700">
                    {p.paymentRef}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{p.customerName}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onViewInvoice(p.invoiceId)}
                      className="font-mono text-xs font-semibold text-blue-600 hover:underline"
                    >
                      {p.invoiceNumber}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatMoney(p.amount, p.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{p.date}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-700">{p.method}</td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. REMINDER AUTOMATION ENGINE, TEMPLATES & AI MESSAGE ASSISTANT
// ============================================================================

function RemindersAndAIView({
  reminderJobs,
  setReminderJobs,
  templates,
  setTemplates,
  invoices,
  business,
  getCustomerById,
  onSendManualReminder,
  onShowToast,
}) {
  const [subTab, setSubTab] = useState('queue'); // 'queue' | 'templates' | 'ai'
  const [newTplName, setNewTplName] = useState('');
  const [newTplBody, setNewTplBody] = useState('');

  // AI Message Assistant State
  const unpaidInvoices = invoices.filter((i) => i.status !== 'Paid');
  const [aiInvoiceId, setAiInvoiceId] = useState(unpaidInvoices[0]?.id || invoices[0]?.id);
  const [aiTone, setAiTone] = useState('Professional');
  const [aiChannel, setAiChannel] = useState('WhatsApp');
  const [aiGeneratedText, setAiGeneratedText] = useState('');

  const runScheduledJobsNow = () => {
    const scheduledCount = reminderJobs.filter((j) => j.status === 'Scheduled').length;
    if (scheduledCount === 0) {
      onShowToast('No pending scheduled jobs in queue right now.');
      return;
    }
    setReminderJobs((prev) =>
      prev.map((j) =>
        j.status === 'Scheduled'
          ? { ...j, status: 'Delivered', scheduledAt: '2026-11-25 (Dispatched)' }
          : j
      )
    );
    onShowToast(`Background worker executed: ${scheduledCount} scheduled reminders delivered!`);
  };

  const generateAiReminder = () => {
    const inv = invoices.find((i) => i.id === aiInvoiceId) || invoices[0];
    const cust = getCustomerById(inv.customerId);
    const amt = formatMoney(inv.amountDue || inv.total, inv.currency);
    const link = `https://payme.in/pay/${inv.invoiceNumber.toLowerCase()}`;

    const drafts = {
      Friendly: `Hi ${cust.name}, hope you're having a great week! Just a quick, friendly note from ${business.name} regarding invoice ${inv.invoiceNumber} for ${amt} (due ${inv.dueDate}). Whenever convenient, you can settle it in one click here: ${link}. Thank you!`,
      Professional: `Hello ${cust.name}, this is a payment reminder from ${business.name} for invoice ${inv.invoiceNumber} amounting to ${amt}, due on ${inv.dueDate}. Please use our secure checkout link to complete payment: ${link}. Let us know if you need any assistance.`,
      Firm: `Dear ${cust.name}, our records show invoice ${inv.invoiceNumber} for ${amt} (due ${inv.dueDate}) remains unpaid. We kindly request you to prioritize clearing this balance today via ${link} so we can keep your account current. — ${business.name}`,
      'Final Notice': `Dear ${cust.name}, this is a final reminder from ${business.name} regarding the overdue balance of ${amt} on invoice ${inv.invoiceNumber}. Please arrange immediate payment through ${link} or reply today with your confirmed payment date.`,
    };

    setAiGeneratedText(drafts[aiTone] || drafts.Professional);
  };

  useEffect(() => {
    if (aiInvoiceId) generateAiReminder();
  }, [aiInvoiceId, aiTone]);

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!newTplName.trim() || !newTplBody.trim()) return;
    setTemplates((prev) => [
      ...prev,
      {
        id: `tpl_${Date.now()}`,
        name: newTplName,
        type: 'Custom',
        channel: 'WhatsApp & Email',
        subject: `Payment Reminder — {{invoice_number}}`,
        body: newTplBody,
      },
    ]);
    setNewTplName('');
    setNewTplBody('');
    onShowToast('Custom reminder template saved!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Reminder Automation Engine</h1>
          <p className="text-sm text-slate-500">
            Smart background scheduler with automatic cancellation on payment & retry policies.
          </p>
        </div>
        <button
          onClick={runScheduledJobsNow}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm"
        >
          <Play className="w-4 h-4 text-emerald-400" />
          Run Scheduled Jobs Now
        </button>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'queue', label: 'Scheduled & Sent Queue' },
          { id: 'ai', label: 'AI Message Assistant' },
          { id: 'templates', label: 'Reminder Templates' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === t.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'queue' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/60">
                  <th className="py-3 px-6">Invoice</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Scheduled Time</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {reminderJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-blue-600">
                      {job.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {job.customerName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        {job.channel === 'WhatsApp' ? (
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        {job.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{job.templateName}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{job.scheduledAt}</td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Sparkles className="w-4 h-4" /> AI Payment Reminder Assistant
            </div>
            <p className="text-xs text-slate-500">
              Generates polite, compliant, non-threatening follow-up messages tailored to customer balance and overdue status.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Unpaid Invoice
              </label>
              <select
                value={aiInvoiceId}
                onChange={(e) => setAiInvoiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {unpaidInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} — {getCustomerById(inv.customerId).company} (
                    {formatMoney(inv.amountDue, inv.currency)} · {inv.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Message Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Friendly', 'Professional', 'Firm', 'Final Notice'].map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setAiTone(tone)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      aiTone === tone
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Delivery Channel
              </label>
              <div className="flex gap-2">
                {['WhatsApp', 'Email'].map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setAiChannel(ch)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border ${
                      aiChannel === ch
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Generated Message Preview (Editable)
              </label>
              <textarea
                rows={6}
                value={aiGeneratedText}
                onChange={(e) => setAiGeneratedText(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm leading-relaxed focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSendManualReminder(aiInvoiceId, aiChannel, aiGeneratedText)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send via {aiChannel} Now
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {tpl.type}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {tpl.channel}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{tpl.name}</h3>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {tpl.body}
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleAddTemplate}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 self-start"
          >
            <h3 className="font-bold text-base text-slate-900">Create Custom Template</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                required
                value={newTplName}
                onChange={(e) => setNewTplName(e.target.value)}
                placeholder="e.g. Gentle Monday Nudge"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message Body
              </label>
              <textarea
                rows={4}
                required
                value={newTplBody}
                onChange={(e) => setNewTplBody(e.target.value)}
                placeholder="Hi {{customer_name}}, invoice {{invoice_number}} for {{amount_due}}..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Variables: {'{{customer_name}}'}, {'{{invoice_number}}'}, {'{{amount_due}}'},{' '}
                {'{{due_date}}'}, {'{{payment_link}}'}
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold"
            >
              Save Template
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 12. REPORTS VIEW (AGING, TOP CUSTOMERS, CHANNEL PERFORMANCE)
// ============================================================================

function ReportsView({ invoices, payments, reminderJobs, currency, getCustomerById }) {
  // Accounts Receivable Aging Buckets
  const aging = useMemo(() => {
    const buckets = [
      { label: '0–7 days overdue', amount: 0, count: 0, color: 'bg-amber-500' },
      { label: '8–30 days overdue', amount: 0, count: 0, color: 'bg-rose-500' },
      { label: '31–60 days overdue', amount: 0, count: 0, color: 'bg-red-600' },
      { label: '61–90 days overdue', amount: 0, count: 0, color: 'bg-red-800' },
      { label: '90+ days overdue', amount: 0, count: 0, color: 'bg-slate-900' },
    ];

    invoices.forEach((inv) => {
      if (inv.amountDue <= 0) return;
      if (inv.dueDate >= TODAY_STR) return;
      const daysOver = Math.floor(
        (new Date(TODAY_STR) - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24)
      );
      if (daysOver <= 7) {
        buckets[0].amount += inv.amountDue;
        buckets[0].count += 1;
      } else if (daysOver <= 30) {
        buckets[1].amount += inv.amountDue;
        buckets[1].count += 1;
      } else if (daysOver <= 60) {
        buckets[2].amount += inv.amountDue;
        buckets[2].count += 1;
      } else if (daysOver <= 90) {
        buckets[3].amount += inv.amountDue;
        buckets[3].count += 1;
      } else {
        buckets[4].amount += inv.amountDue;
        buckets[4].count += 1;
      }
    });
    return buckets;
  }, [invoices]);

  const maxAging = Math.max(...aging.map((b) => b.amount), 1);

  const deliveredCount = reminderJobs.filter((r) => r.status === 'Delivered').length;
  const scheduledCount = reminderJobs.filter((r) => r.status === 'Scheduled').length;
  const failedCount = reminderJobs.filter((r) => r.status === 'Failed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Reports & Cash Flow Intelligence</h1>
        <p className="text-sm text-slate-500">
          Aging analysis, customer receivables ranking, and reminder conversion metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aging Report */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-slate-900">Accounts Receivable Aging Report</h2>
          <div className="space-y-4 pt-2">
            {aging.map((b) => (
              <div key={b.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{b.label}</span>
                  <span className="font-bold text-slate-900">
                    {formatMoney(b.amount, currency)} ({b.count})
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.round((b.amount / maxAging) * 100)}%` }}
                    className={`h-full ${b.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder Performance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <h2 className="font-bold text-base text-slate-900">Reminder Automation Performance</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700">Delivered</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{deliveredCount + 18}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-semibold text-blue-700">Scheduled</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{scheduledCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <p className="text-xs font-semibold text-rose-700">Failed</p>
              <p className="text-2xl font-bold text-rose-900 mt-1">{failedCount}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm flex items-center justify-between">
            <span className="text-slate-600">Payments collected after reminder</span>
            <span className="font-bold text-emerald-600">
              {payments.filter((p) => p.status === 'Successful').length} invoices (84% recovery)
            </span>
          </div>
        </div>
      </div>

      {/* Top Customers Owed */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-900">
          Customer Receivables Ranking
        </div>
        <div className="divide-y divide-slate-100">
          {invoices
            .filter((i) => i.amountDue > 0)
            .sort((a, b) => b.amountDue - a.amountDue)
            .map((inv) => {
              const cust = getCustomerById(inv.customerId);
              return (
                <div
                  key={inv.id}
                  className="px-6 py-3.5 flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{cust.company}</p>
                    <p className="text-xs text-slate-500">
                      {inv.invoiceNumber} · Due {inv.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={inv.status} />
                    <span className="font-bold text-slate-900">
                      {formatMoney(inv.amountDue, inv.currency)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 13. SETTINGS & INTEGRATIONS VIEW
// ============================================================================

function SettingsView({ business, setBusiness, pricingPlans, onShowToast }) {
  const [tab, setTab] = useState('integrations'); // 'profile' | 'schedule' | 'integrations' | 'billing' | 'team'
  const [testWaPhone, setTestWaPhone] = useState(business.phone);

  const toggleScheduleRule = (id) => {
    setBusiness((prev) => ({
      ...prev,
      reminderSchedule: prev.reminderSchedule.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    }));
    onShowToast('Reminder automation schedule updated.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Workspace Settings</h1>
        <p className="text-sm text-slate-500">
          Configure official WhatsApp Business API, Email, Razorpay/Stripe, and billing plan.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'integrations', label: 'Integrations (WhatsApp & Pay)' },
          { id: 'profile', label: 'Business Profile' },
          { id: 'schedule', label: 'Reminder Rules' },
          { id: 'billing', label: 'Subscription Plan' },
          { id: 'team', label: 'Team Members' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${
              tab === t.id
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'integrations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Official WhatsApp Business API Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">WhatsApp Business Cloud API</h3>
                  <p className="text-xs text-slate-500">Official Meta Cloud API Provider</p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  business.whatsappConnected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {business.whatsappConnected ? 'Connected ✓' : 'Not Connected'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              PayMe uses an abstract messaging provider layer connected exclusively to official WhatsApp Business API endpoints for template-approved payment reminders.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setBusiness((prev) => ({
                    ...prev,
                    whatsappConnected: !prev.whatsappConnected,
                  }));
                  onShowToast(
                    !business.whatsappConnected
                      ? 'Official WhatsApp Business API connected!'
                      : 'WhatsApp reminders paused.'
                  );
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                  business.whatsappConnected
                    ? 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {business.whatsappConnected ? 'Disconnect / Pause' : 'Connect WhatsApp'}
              </button>

              {business.whatsappConnected && (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={testWaPhone}
                    onChange={(e) => setTestWaPhone(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    onClick={() =>
                      onShowToast(`Test WhatsApp template sent to ${testWaPhone}!`)
                    }
                    className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shrink-0"
                  >
                    Send Test
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Gateway Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Payment Link Gateway</h3>
                  <p className="text-xs text-slate-500">Modular Razorpay / Stripe Webhook Engine</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Connected ✓
              </span>
            </div>

            <div className="flex items-center gap-3">
              {['Razorpay', 'Stripe'].map((prov) => (
                <button
                  key={prov}
                  onClick={() => {
                    setBusiness((prev) => ({ ...prev, paymentProvider: prov }));
                    onShowToast(`Switched active payment link provider to ${prov}.`);
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold ${
                    business.paymentProvider === prov
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {prov} {prov === 'Razorpay' ? '(UPI / India)' : '(Global Cards)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-2xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={business.name}
                onChange={(e) => setBusiness((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN</label>
              <input
                type="text"
                value={business.gstin}
                onChange={(e) => setBusiness((p) => ({ ...p, gstin: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={business.address}
              onChange={(e) => setBusiness((p) => ({ ...p, address: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Currency
            </label>
            <select
              value={business.currency}
              onChange={(e) => setBusiness((p) => ({ ...p, currency: e.target.value }))}
              className="w-full sm:w-48 px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => onShowToast('Business profile saved.')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold"
          >
            Save Changes
          </button>
        </div>
      )}

      {tab === 'schedule' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-2xl space-y-3">
          <h3 className="font-bold text-slate-900">Automated Follow-Up Cadence</h3>
          {business.reminderSchedule.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">{rule.label}</p>
                <p className="text-xs text-slate-500 uppercase">Channel: {rule.channel}</p>
              </div>
              <button
                onClick={() => toggleScheduleRule(rule.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  rule.enabled
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {rule.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'billing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((p) => {
            const isCurrent = business.plan === p.id;
            return (
              <div
                key={p.id}
                className={`bg-white p-6 rounded-2xl border ${
                  isCurrent ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200'
                } flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    {isCurrent && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        Active Plan
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-extrabold mt-3">
                    ₹{p.priceINR}
                    <span className="text-xs font-normal text-slate-500">/mo</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    {p.features.map((f) => (
                      <li key={f}>✓ {f}</li>
                    ))}
                  </ul>
                </div>
                <button
                  disabled={isCurrent}
                  onClick={() => {
                    setBusiness((prev) => ({ ...prev, plan: p.id }));
                    onShowToast(`Workspace upgraded to ${p.name} plan!`);
                  }}
                  className={`mt-6 w-full py-2.5 rounded-xl text-xs font-semibold ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Switch to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'team' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Workspace Team</h3>
              <p className="text-xs text-slate-500">
                Multi-user access is included on the Business plan.
              </p>
            </div>
            <button
              onClick={() => onShowToast('Team invitation link sent!')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              + Invite Member
            </button>
          </div>
          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Arjun Deshmukh (You)</p>
                <p className="text-xs text-slate-500">arjun@apexindustrial.in</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100">Owner</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Priya Subramanian</p>
                <p className="text-xs text-slate-500">finance@apexindustrial.in</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100">
                Accounts Manager
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 14. SUPER ADMIN DASHBOARD (SAAS METRICS, DYNAMIC PRICING & LOGS)
// ============================================================================

function SuperAdminView({
  pricingPlans,
  setPricingPlans,
  invoices,
  payments,
  reminderJobs,
  onShowToast,
}) {
  const updatePlanPrice = (id, newPrice) => {
    const val = Math.max(0, Number(newPrice) || 0);
    setPricingPlans((prev) => prev.map((p) => (p.id === id ? { ...p, priceINR: val } : p)));
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
            Super Admin Control Plane
          </span>
          <h1 className="text-2xl font-bold mt-2">PayMe SaaS Platform Metrics</h1>
          <p className="text-xs text-indigo-200 mt-1">
            Multi-tenant oversight, live pricing management, and background job health.
          </p>
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Monthly Recurring Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹1,84,600</p>
          <p className="text-xs text-emerald-600 mt-1">312 active subscriptions</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Total SMB Tenants</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,420</p>
          <p className="text-xs text-slate-500 mt-1">1,108 Free · 224 Pro · 88 Business</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Total Payment Volume</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">₹4.82 Cr</p>
          <p className="text-xs text-slate-500 mt-1">Across {invoices.length * 420} invoices</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Messages Dispatched</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">48,910</p>
          <p className="text-xs text-slate-500 mt-1">WhatsApp API & Transactional Email</p>
        </div>
      </div>

      {/* Dynamic Pricing Manager (Updates Public Landing Page Live!) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-slate-900">
              Dynamic SaaS Pricing Editor
            </h2>
            <p className="text-xs text-slate-500">
              Changes made here immediately update the public marketing landing page and billing screens.
            </p>
          </div>
          <button
            onClick={() => onShowToast('Public landing page pricing updated live!')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Publish Pricing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">{plan.name} Plan</p>
              <label className="block text-xs text-slate-500">Monthly Price (INR ₹)</label>
              <input
                type="number"
                value={plan.priceINR}
                onChange={(e) => updatePlanPrice(plan.id, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-bold"
              />
            </div>
          ))}
        </div>
      </div>

      {/* System Webhook & Worker Logs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-base text-slate-900 mb-3">
          Recent Background Jobs & Webhook Audit Log
        </h2>
        <div className="space-y-2 font-mono text-xs">
          {reminderJobs.slice(0, 4).map((j) => (
            <div
              key={j.id}
              className="p-2.5 rounded-lg bg-slate-900 text-slate-200 flex items-center justify-between"
            >
              <span>
                [WORKER:BULLMQ] job={j.id} inv={j.invoiceNumber} channel={j.channel}
              </span>
              <span className="text-emerald-400">{j.status.toUpperCase()}</span>
            </div>
          ))}
          {payments.slice(0, 2).map((p) => (
            <div
              key={p.id}
              className="p-2.5 rounded-lg bg-slate-900 text-slate-200 flex items-center justify-between"
            >
              <span>
                [WEBHOOK:IDEMPOTENT] ref={p.paymentRef} inv={p.invoiceNumber} amt={p.amount}
              </span>
              <span className="text-blue-400">{p.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 15. MODALS (CREATE INVOICE, SEND REMINDER, RECORD PAYMENT, DOCS)
// ============================================================================

function CreateInvoiceModal({
  customers,
  business,
  nextNumber,
  onClose,
  onAddCustomer,
  onSubmit,
}) {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [showNewCustInline, setShowNewCustInline] = useState(false);
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('+91 ');
  const [newCustEmail, setNewCustEmail] = useState('');

  const [invoiceNumber, setInvoiceNumber] = useState(nextNumber);
  const [invoiceDate, setInvoiceDate] = useState(TODAY_STR);
  const [dueDate, setDueDate] = useState('2026-12-05');
  const [currency, setCurrency] = useState(business.currency || 'INR');
  const [notes, setNotes] = useState('Thank you for your business.');
  const [paymentInstructions, setPaymentInstructions] = useState(
    'Pay online instantly via UPI, Card, or NetBanking using the PayMe link.'
  );

  const [items, setItems] = useState([
    { id: 'item_1', description: 'Wholesale Supply Order', quantity: 1, rate: 25000, tax: 18 },
  ]);

  const updateItem = (idx, field, val) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, [field]: field === 'description' ? val : Number(val) || 0 } : it
      )
    );
  };

  const subtotal = items.reduce((s, it) => s + it.quantity * it.rate, 0);
  const taxTotal = items.reduce((s, it) => s + it.quantity * it.rate * ((it.tax || 0) / 100), 0);
  const total = Math.round((subtotal + taxTotal) * 100) / 100;

  const handleSave = (isDraft) => {
    let targetCustomerId = customerId;
    if (showNewCustInline && newCustCompany.trim()) {
      const created = onAddCustomer({
        name: newCustName || newCustCompany,
        company: newCustCompany,
        phone: newCustPhone,
        whatsapp: newCustPhone,
        email: newCustEmail || 'accounts@customer.in',
        address: 'India',
      });
      targetCustomerId = created.id;
    }

    onSubmit(
      {
        invoiceNumber,
        customerId: targetCustomerId,
        invoiceDate,
        dueDate,
        currency,
        items,
        subtotal,
        taxTotal,
        total,
        notes,
        paymentInstructions,
      },
      isDraft
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">Create New Invoice</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Customer Selector or Inline Add */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Customer *</label>
              <button
                type="button"
                onClick={() => setShowNewCustInline(!showNewCustInline)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {showNewCustInline ? 'Select Existing Customer' : '+ Add New Customer'}
              </button>
            </div>

            {!showNewCustInline ? (
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name} · {c.whatsapp})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Company Name *"
                  value={newCustCompany}
                  onChange={(e) => setNewCustCompany(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                />
                <input
                  type="text"
                  placeholder="WhatsApp Number (+91...)"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                />
              </div>
            )}
          </div>

          {/* Invoice Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice #</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c}>
                    {c} ({CURRENCIES[c].symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Line Items</label>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={it.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={it.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    placeholder="Item description"
                    className="col-span-12 sm:col-span-5 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="col-span-4 sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <input
                    type="number"
                    value={it.rate}
                    onChange={(e) => updateItem(idx, 'rate', e.target.value)}
                    placeholder="Rate"
                    className="col-span-4 sm:col-span-3 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <input
                    type="number"
                    value={it.tax}
                    onChange={(e) => updateItem(idx, 'tax', e.target.value)}
                    placeholder="Tax %"
                    className="col-span-4 sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setItems((prev) => [
                  ...prev,
                  { id: `item_${Date.now()}`, description: '', quantity: 1, rate: 0, tax: 18 },
                ])
              }
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              + Add Line Item
            </button>
          </div>

          {/* Summary Strip */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Subtotal: <span className="font-semibold">{formatMoney(subtotal, currency)}</span> ·
              Tax: <span className="font-semibold">{formatMoney(taxTotal, currency)}</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">
              Total: {formatMoney(total, currency)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Instructions
              </label>
              <input
                type="text"
                value={paymentInstructions}
                onChange={(e) => setPaymentInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-100"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm"
          >
            Create Invoice & Schedule Reminders
          </button>
        </div>
      </div>
    </div>
  );
}

function AddCustomerModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: name || company,
      company: company || name,
      phone,
      whatsapp: phone,
      email,
      address,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Add Customer</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
          <input
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            WhatsApp / Phone *
          </label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
        >
          Save Customer
        </button>
      </form>
    </div>
  );
}

function SendReminderModal({ invoice, customer, business, templates, onClose, onSend }) {
  const [channel, setChannel] = useState('WhatsApp');
  const [selectedTplId, setSelectedTplId] = useState(templates[2]?.id || templates[0]?.id);
  const [message, setMessage] = useState('');

  const hydrateMessage = (tplBody) => {
    const link = `https://payme.in/pay/${invoice.invoiceNumber.toLowerCase()}`;
    return tplBody
      .replace(/{{customer_name}}/g, customer.name)
      .replace(/{{invoice_number}}/g, invoice.invoiceNumber)
      .replace(/{{amount_due}}/g, formatMoney(invoice.amountDue || invoice.total, invoice.currency))
      .replace(/{{due_date}}/g, invoice.dueDate)
      .replace(/{{payment_link}}/g, link)
      .replace(/{{business_name}}/g, business.name);
  };

  useEffect(() => {
    const tpl = templates.find((t) => t.id === selectedTplId) || templates[0];
    if (tpl) setMessage(hydrateMessage(tpl.body));
  }, [selectedTplId]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Send Payment Reminder · {invoice.invoiceNumber}
            </h2>
            <p className="text-xs text-slate-500">
              To {customer.company} ({channel === 'WhatsApp' ? customer.whatsapp : customer.email})
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          {['WhatsApp', 'Email'].map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setChannel(ch)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 ${
                channel === ch
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {ch === 'WhatsApp' ? (
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-blue-400" />
              )}
              {ch}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Template</label>
          <select
            value={selectedTplId}
            onChange={(e) => setSelectedTplId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Message Preview</label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm leading-relaxed"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSend(invoice.id, channel, message)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> Dispatch Reminder
          </button>
        </div>
      </div>
    </div>
  );
}

function RecordPaymentModal({ invoice, customer, onClose, onConfirm }) {
  const [amount, setAmount] = useState(invoice.amountDue);
  const [method, setMethod] = useState('UPI / Bank Transfer');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Record Payment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Recording payment for <span className="font-bold text-slate-800">{invoice.invoiceNumber}</span> ({customer.company}). Balance due:{' '}
          <span className="font-bold text-slate-900">
            {formatMoney(invoice.amountDue, invoice.currency)}
          </span>
        </p>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Amount Received ({CURRENCIES[invoice.currency]?.symbol})
          </label>
          <input
            type="number"
            max={invoice.amountDue}
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Enter a partial amount to mark as Partially Paid, or full amount to cancel all future reminders.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
          >
            <option>UPI / Bank Transfer</option>
            <option>NEFT / RTGS</option>
            <option>Razorpay Payment Link</option>
            <option>Cheque / Cash</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => onConfirm(invoice.id, amount, method)}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
}

function ArchitectureDocsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              PayMe Production Architecture, PostgreSQL Schema & API Specs
            </h2>
            <p className="text-xs text-slate-500">
              Multi-tenant SaaS reference blueprint (Sections 37–52)
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">1. Modular Provider Architecture</h3>
            <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 overflow-x-auto">
{`NotificationService
 ├── EmailProvider (Resend / Postmark / SES)
 ├── WhatsAppProvider (Official Meta Cloud API)
 └── FutureProvider (SMS / RCS)

PaymentService
 ├── RazorpayProvider (UPI, NetBanking, Cards + Idempotent Webhooks)
 └── StripeProvider (Global Multi-Currency Checkout)`}
            </pre>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              2. Multi-Tenant PostgreSQL Schema (Strict business_id isolation)
            </h3>
            <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 overflow-x-auto">
{`users (id, name, email, phone, password_hash, created_at, updated_at)
businesses (id, owner_id, name, logo, address, gstin, currency, created_at)
customers (id, business_id, name, company_name, phone, email, whatsapp_number, address, created_at)
invoices (id, business_id, customer_id, invoice_number, invoice_date, due_date, subtotal, tax, total, amount_paid, amount_due, currency, status, payment_link, created_at)
invoice_items (id, invoice_id, description, quantity, rate, tax, total)
payments (id, invoice_id, customer_id, amount, currency, payment_method, provider_payment_id, status, paid_at)
reminders (id, invoice_id, channel, template_id, scheduled_at, sent_at, status, error_message)
reminder_templates (id, business_id, name, channel, subject, body, type)
subscriptions (id, business_id, plan, provider, provider_subscription_id, status, current_period_start, current_period_end)
activity_logs (id, business_id, user_id, entity_type, entity_id, action, metadata, created_at)`}
            </pre>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">3. Environment Variables (.env.example)</h3>
            <pre className="p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 overflow-x-auto">
{`DATABASE_URL="postgresql://user:pass@localhost:5432/payme_prod"
AUTH_SECRET="replace-with-32-char-random-secret"
EMAIL_API_KEY="re_xxxxxxxxx"
WHATSAPP_API_KEY="EAABxxxxxxxx"
WHATSAPP_PHONE_NUMBER_ID="10482910481"
PAYMENT_PROVIDER_KEY="rzp_live_xxxxxxx"
PAYMENT_PROVIDER_SECRET="xxxxxxxxxxxxxxx"
REDIS_URL="redis://localhost:6379"
AI_API_KEY="xxxxxxxxxxxxxxx"`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
