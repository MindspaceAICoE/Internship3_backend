/**
 * Some predefined delay values (in milliseconds).
 */
export enum Delays {
  Short = 500,
  Medium = 2000,
  Long = 5000,
}

/**
 * Returns a Promise<string> that resolves after a given time.
 *
 * @param {string} name - A name.
 * @param {number=} [delay=Delays.Medium] - A number of milliseconds to delay resolution of the Promise.
 * @returns {Promise<string>}
 */
function delayedHello(
  name: string,
  delay: number = Delays.Medium,
): Promise<string> {
  return new Promise((resolve: (value?: string) => void) =>
    setTimeout(() => resolve(`Hello, ${name}`), delay),
  );
}

// Please see the comment in the .eslintrc.json file about the suppressed rule!
// Below is an example of how to use ESLint errors suppression. You can read more
// at https://eslint.org/docs/latest/user-guide/configuring/rules#disabling-rules

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
export async function greeter(name: any) {
  // The name parameter should be of type string. Any is used only to trigger the rule.
  return await delayedHello(name, Delays.Long);
}


import express, { Request, Response } from 'express';
import router from './outlook/Auth/auth-routes.js';
import emailrouter from './outlook/Routes/Outlook-Email-Routes.js';
import eventrouter from './outlook/Routes/Outlook-Event-Routes.js';
import contactrouter from './outlook/Routes/Outlook-Contact-Routes.js';
import todolist_task_router from './outlook/Routes/Outlook-ToDoList&Tasks-Routes.js';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', router);
app.use('/api/email', emailrouter);
app.use('/api/event', eventrouter);
app.use('/api/contact', contactrouter);
app.use('/api/todo/list/', todolist_task_router);

app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to the Outlook email API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

