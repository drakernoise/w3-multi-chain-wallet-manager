const blurt = require('@blurtfoundation/blurtjs');
console.log('Blurt config keys:', Object.keys(blurt.config.get('address_prefix') ? { has_prefix: true } : blurt.config));
console.log('Full config:', blurt.config);
