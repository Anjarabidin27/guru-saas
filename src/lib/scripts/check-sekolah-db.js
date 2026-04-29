const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const [key, ...val] = line.split('=');
      if (key && val) {
        process.env[key.trim()] = val.join('=').trim().replace(/^"(.*)"$/, '$1');
      }
    });
  }
}

loadEnv();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runCheck() {
  console.log('--- CHECKING SEKOLAH TABLE ---');
  const { data: sData, error: sError } = await supabase.from('sekolah').select('*').limit(1);
  if (sError) {
    console.error('SEKOLAH_ERROR:', sError);
  } else {
    console.log('SEKOLAH_COLUMNS:', Object.keys(sData[0] || {}));
    console.log('SEKOLAH_COUNT:', (await supabase.from('sekolah').select('*', { count: 'exact', head: true })).count);
  }

  console.log('\n--- CHECKING PROFILES TABLE ---');
  const { data: pData, error: pError } = await supabase.from('profiles').select('*').limit(1);
  if (pError) {
    console.error('PROFILES_ERROR:', pError);
  } else {
    console.log('PROFILES_COLUMNS:', Object.keys(pData[0] || {}));
  }

  console.log('\n--- TRYING THE FAILING QUERY ---');
  const { data: qData, error: qError } = await supabase
    .from('sekolah')
    .select(`
      id, nama, alamat, kota, kode_sekolah, status_langganan, kuota_guru, created_at,
      admin:admin_id(id, nama_lengkap)
    `)
    .limit(1);
  
  if (qError) {
    console.error('QUERY_RELATION_ERROR:', qError.message);
  } else {
    console.log('QUERY_SUCCESS');
  }
}

runCheck();
