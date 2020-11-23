export default function detectDebug()
{
  return process.env.NODE_ENV !== 'production';
}
