import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  // {
  //   label: 'Main',
  //   isTitle: true
  // },
  {
    label: 'Workspace',
    icon: 'home',
    link: '/dashboard'
  },
  // {
  //   label: 'Case',
  //   icon: 'file-text',
  //   link: '/case/case',
  // },
  // {
  //   label: 'Users',
  //   icon: 'user',
  //   link: '/user/user',
  // },

  // {
  //   label: 'OBD',
  //   icon: 'phone',
  //   subItems: [
  //     {
  //       label: 'Create',
  //       icon: 'edit',
  //       link: '/obd/create',
  //     },
  //     {
  //       label: 'Analyse',
  //       icon: 'file-text',
  //       link: '/obd/analyse'
  //     }
  //   ]
  // },
  {
    label: 'Users',
    icon: 'users',
    link: '/team/team',
  },
  {
    label: 'Client',
    icon: 'user',
    link: '/client/client',
  },
  // {
  //   label: 'Branch',
  //   icon: 'calendar',
  //   link: '/branch/branch',
  // },
  {
    label: 'Vender',
    icon: 'users',
    link: '/vander/vander',
  },
  {
    label: 'Booking',
    icon: 'calendar',
    link: '/shipment/shipment',
  },
  
  {
    label: 'Manifest',
    icon: 'file-text',
    link: '/manifest/manifest',
  },
  // {
  //   label: 'Delivery',
  //   icon: 'truck',
  //   link: '/delivery/delivery',
  // },
  // {
  //   label: 'Views',
  //   icon: 'eye',
  //   link: '/report/deliveries',
  // },
  // {
  //   label: 'Report',
  //   icon: 'bar-chart-2',
  //   subItems: [
  //     {
  //       label: 'Tracking Report',
  //       icon: 'map',
  //       link: '/report/report',
  //     },
      // {
      //   label: 'Views',
      //   icon: 'file-text',
      //   link: '/report/deliveries'
      // }
    // ]
    // link: '/report/report',
  // },
  // {
  //   label: 'Credit',
  //   icon: 'credit-card',
  //   link: '/credit/credit',
  // },


  // {
  //   label: 'Task',
  //   icon: 'pen-tool',
  //   link: '/task/task',
  // },
  // {
  //   label: 'Notes',
  //   icon: 'command',
  //   link: '/notes/notes',
  // },
  // {
  //   label: 'Act',
  //   icon: 'book',
  //   link: '/act/act',
  // },
  // {
  //   label: 'Uploads',
  //   icon: 'upload',
  //   link: '/uploads/uploads',
  // },
  // {
  //   label: 'Expense',
  //   icon: 'dollar-sign',
  //   link: '/expense/expense',
  // },
  // {
  //   label: 'Groups',
  //   icon: 'users',
  //   link: '/groups/groups',
  // },
  // {
  //   label: 'Setting',
  //   icon: 'settings',
  //   subItems: [
  //     {
  //       label: 'Case Status',
  //       icon: 'edit',
  //       link: '/setting/cash-status',
  //     },
  //     {
  //       label: 'Case Type',
  //       icon: 'file-text',
  //       link: '/setting/cash-type'
  //     },
  //     {
  //       label: 'Court',
  //       icon: 'file-text',
  //       link: '/setting/court'
  //     },{
  //       label: 'Court Type',
  //       icon: 'edit',
  //       link: '/setting/court-type',
  //     },
  //     {
  //       label: 'General Setting',
  //       icon: 'file-text',
  //       link: '/setting/general-setting'
  //     },
  //     {
  //       label: 'Judge',
  //       icon: 'file-text',
  //       link: '/setting/judge'
  //     },
  //     {
  //       label: 'Tax',
  //       icon: 'file-text',
  //       link: '/setting/tax'
  //     }
  //   ]
  // },
  // {
  //   label: 'Click To Call',
  //   icon: 'life-buoy',
  //   subItems: [
  //     {
  //       label: 'Assign Lead',
  //       icon: 'edit-3',
  //       link: '/assign/assign-lead',
  //     },
  //     {
  //       label: 'Status',
  //       icon: 'disc',
  //       link: '/assign/status'
  //     }
  //   ]
  // },

  // {
  //   label: 'User',
  //   icon: 'user',
  //   link: '/apps/user/userdata',
  // },
  // {
  //   label: 'Authentication',
  //   icon: 'unlock',
  //   subItems: [
  //     {
  //       label: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       label: 'Register',
  //       link: '/auth/register',
  //     },
  //   ]
  // },
  // {
  //   label: 'Error',
  //   icon: 'cloud-off',
  //   subItems: [
  //     {
  //       label: '404',
  //       link: '/error/404',
  //     },
  //     {
  //       label: '500',
  //       link: '/error/500',
  //     },
  //   ]
  // },
];

export const COMPANY: MenuItem[] = [
  // {
  //   label: 'Main',
  //   isTitle: true
  // },
  {
    label: 'Dashboard',
    icon: 'grid',
    link: '/dashboard'
  },
  // {
  //   label: 'OBD',
  //   icon: 'phone',
  //   subItems: [

  //     {
  //       label: 'Analyse',
  //       icon: 'file-text',
  //       link: '/obd/analyse'
  //     }
  //   ]
  // },
  {
    label: 'Users',
    icon: 'user',
    link: '/user/user',
  },

  {
    label: 'IVR',
    icon: 'message-square',
    link: '/ivr/ivr',
  },

  {
    label: 'Credit',
    icon: 'credit-card',
    link: '/credit/credit',
  },
  {
    label: 'Uploads',
    icon: 'upload',
    link: '/uploads/uploads',
  },
  {
    label: 'DID',
    icon: 'command',
    link: '/did-management',
  },
  {
    label: 'Groups',
    icon: 'users',
    link: '/groups/groups',
  },
  // {
  //   label: 'Setting',
  //   icon: 'settings',
  //   subItems: [
  //     {
  //       label: 'API-key',
  //       icon: 'edit',
  //       link: '/setting/api-key',
  //     },
  //     {
  //       label: 'Webhook',
  //       icon: 'file-text',
  //       link: '/setting/webhook'
  //     },
  //     {
  //       label: 'SMS',
  //       icon: 'file-text',
  //       link: '/setting/sms'
  //     }
  //   ]
  // },

];
