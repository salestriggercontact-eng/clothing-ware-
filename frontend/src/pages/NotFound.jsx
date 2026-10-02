import { SearchX } from 'lucide-react';
import Empty from '../components/Empty';
export default function NotFound() {
  return <Empty icon={SearchX} title="Page not found" text="The link may be broken or the page was removed." to="/" cta="Go to home" />;
}
