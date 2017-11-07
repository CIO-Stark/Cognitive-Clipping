let callback = {
  open: null,
  dismiss: null
};

export function subscribe (which, cb) {
  callback[which] = cb;
}

export function open (content) {
  callback.open(content);
}

export function dismiss () {
  callback.dismiss();
}