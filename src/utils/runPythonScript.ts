import { Options, PythonShell } from 'python-shell';

export default function runPythonScript(
  path: string,
  options?: Options | undefined
): Promise<any> {
  return new Promise((resolve, reject) => {
    PythonShell.run(path, options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
