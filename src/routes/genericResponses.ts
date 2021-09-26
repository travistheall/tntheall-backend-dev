import { Response } from 'express';
const dev = process.env.DEVELOPMENT === 'true';

const server_500 = (res: Response, msg?: string) => {
  if (dev && msg) {
    return res.status(500).json({ errors: [{ msg: msg }] });
  } else {
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
};

const invalid_400 = (res: Response, msg?: string) => {
  if (msg) {
    return res.status(400).json({ errors: [{ msg: msg }] });
  } else {
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
  }
};

const not_found_404 = (res: Response, msg?: string) => {
  if (msg) {
    res.status(404).json({ errors: [{ msg: msg }] });
  } else {
    return res.status(404).json({ errors: [{ msg: 'Not Found' }] });
  }
};

const deletion_200 = (res: Response, msg?: string) => {
  if (msg) {
    res.status(200).json({ success: [{ msg: msg }] });
  } else {
    return res.status(200).json({ success: [{ msg: 'Object Deleted' }] });
  }
};

export { server_500, invalid_400, not_found_404, deletion_200 };
