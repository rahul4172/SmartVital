import os, re
root_dir = 'C:/Users/rahul/Desktop/SmartVital Analysis/frontend/src'

def get_actual_case_path(base_dir, relative_path):
    parts = relative_path.strip('./').split('/')
    curr = base_dir
    for part in parts:
        try:
            items = os.listdir(curr)
        except:
            return None
        lower_map = {i.lower(): i for i in items}
        
        if part.lower() in lower_map:
            curr = os.path.join(curr, lower_map[part.lower()])
        else:
            # Check with extension
            found = False
            for ext in ['.tsx', '.ts', '.jsx', '.js']:
                if (part+ext).lower() in lower_map:
                    curr = os.path.join(curr, lower_map[(part+ext).lower()])
                    found = True
                    break
            if not found:
                return None
    return curr

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all from '...' or from "..."
            imports = re.findall(r'from\s+[\'"]([^\'"]+)[\'"]', content)
            imports += re.findall(r'import\s+[\'"]([^\'"]+)[\'"]', content)
            
            needs_fix = False
            for imp in imports:
                if imp.startswith('.'):
                    # Resolve relative
                    base = root
                    parts = imp.split('/')
                    for p in parts:
                        if p == '.': continue
                        if p == '..': base = os.path.dirname(base)
                    
                    # check actual case
                    actual = get_actual_case_path(base, imp.replace('../', '').replace('./', ''))
                    if actual:
                        # Convert actual back to relative to see if it matches exactly
                        # Actually simpler: check if actual path reconstructed exactly matches
                        expected_end = imp.replace('../', '').replace('./', '').replace('/', '\\')
                        # just check if the actual path string matches the case of the import string
                        imp_norm = imp.replace('/', '\\')
                        
                        # Let's just do a naive check: if the import has 'layout' but the actual folder has 'Layout'
                        if 'layout/' in imp and 'Layout' in actual:
                            content = content.replace(imp, imp.replace('layout', 'Layout'))
                            needs_fix = True
                            print(f'Fixed {imp} in {file}')
                        if 'aiassistant/' in imp.lower() and 'AIAssistant' in actual:
                            content = content.replace(imp, imp.replace('aiassistant', 'AIAssistant').replace('AiAssistant', 'AIAssistant'))
                            needs_fix = True
                            print(f'Fixed {imp} in {file}')
                            
            if needs_fix:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
