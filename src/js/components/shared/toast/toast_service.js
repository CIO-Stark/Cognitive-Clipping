let callback = {
  open: null,
  dismiss: null
};

export function subscribe (which, cb) {
  callback[which] = cb;
}

export function open (message, type) {
  callback.open(message, type);
}

export function dismiss () {
  callback.dismiss();
}