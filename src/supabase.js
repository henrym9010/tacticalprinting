import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://petwkpdcbrkumzjtxqry.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldHdrcGRjYnJrdW16anR4cXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDY3MTgsImV4cCI6MjA5NjUyMjcxOH0.v3Xd2TE1qOA_UdS_ohiPJs9H3CfkM8A5-RM9QWzswQQ';

export const supabase = createClient(supabaseUrl, supabaseKey);