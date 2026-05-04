#!/usr/bin/env python3
"""
Batch refactoring script to convert HTML files to use master layout system.
This script identifies patterns and automatically refactors files.
"""

import os
import re
from pathlib import Path

def refactor_file(file_path):
    """Refactor a single HTML file to use the master layout system."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already refactored
    if '{{#> layouts/main' in content:
        return False
    
    original_content = content
    
    # Extract title
    title_match = re.search(r'<title>(.*?) - Thanh Hải Ceramics</title>', content)
    title = title_match.group(1) if title_match else None
    
    # Extract data-page
    data_page_match = re.search(r'data-page="([^"]*)"', content)
    data_page = data_page_match.group(1) if data_page_match else None
    
    # Extract body class (remove common classes that layout provides)
    body_class_match = re.search(r'<body[^>]*class="([^"]*)"', content)
    body_class = body_class_match.group(1) if body_class_match else None
    if body_class:
        # Remove layout-provided classes
        body_class = body_class.replace('min-h-screen flex flex-col', '').replace('font-archivo', '').strip()
    
    # Check for hideNewsletter
    hide_newsletter = 'hideNewsletter=true' in content
    
    # Extract main class
    main_class_match = re.search(r'<main[^>]*class="([^"]*)"', content)
    main_class = main_class_match.group(1) if main_class_match else None
    if main_class:
        main_class = main_class.replace('flex-grow', '').strip()
    
    # Extract content between <main> and </main> or before footer
    main_content = ''
    main_start = content.find('<main')
    if main_start != -1:
        # Find the opening tag end
        main_tag_end = content.find('>', main_start) + 1
        # Find closing main tag or footer
        main_end = content.find('</main>')
        if main_end == -1:
            main_end = content.find('{{> components/footer')
        if main_end != -1:
            main_content = content[main_tag_end:main_end].strip()
    
    # Extract push styles
    push_styles = ''
    push_styles_match = re.search(r'\{\{#push "styles"\}\}(.*?)\{\{/push\}\}', content, re.DOTALL)
    if push_styles_match:
        push_styles = push_styles_match.group(1).strip()
    
    # Extract push scripts (before closing body)
    push_scripts = ''
    push_scripts_match = re.search(r'\{\{#push "scripts"\}\}(.*?)\{\{/push\}\}', content, re.DOTALL)
    if push_scripts_match:
        push_scripts = push_scripts_match.group(1).strip()
    
    # Build new content
    new_lines = []
    
    # Find debug start
    debug_match = re.search(r'<!-- GSXD-DEBUG:BEGIN.*?-->', content)
    if debug_match:
        new_lines.append(debug_match.group(0))
    
    # Add layout wrapper
    new_lines.append('{{#> layouts/main')
    if title:
        new_lines.append(f'    title="{title}"')
    if data_page:
        new_lines.append(f'    dataPage="{data_page}"')
    if body_class:
        new_lines.append(f'    bodyClass="{body_class}"')
    if main_class:
        new_lines.append(f'    mainClass="{main_class}"')
    if hide_newsletter:
        new_lines.append('    hideNewsletter=true')
    new_lines.append('}}')
    
    # Add push styles if exists
    if push_styles:
        new_lines.append('  {{#push "styles"}}')
        new_lines.append(push_styles)
        new_lines.append('  {{/push}}')
    
    # Add main content
    if main_content:
        new_lines.append('')
        new_lines.append(main_content)
    
    # Add push scripts if exists
    if push_scripts:
        new_lines.append('')
        new_lines.append('  {{#push "scripts"}}')
        new_lines.append(push_scripts)
        new_lines.append('  {{/push}}')
    
    # Close layout
    new_lines.append('{{/layouts/main}}')
    
    # Find debug end
    debug_end_match = re.search(r'<!-- GSXD-DEBUG:END.*?-->', content)
    if debug_end_match:
        new_lines.append(debug_end_match.group(0))
    
    new_content = '\n'.join(new_lines)
    
    # Write back if changed
    if new_content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    
    return False

def main():
    """Main function to process all HTML files."""
    base_dir = Path(__file__).parent
    
    # Directories to process
    dirs_to_process = [
        base_dir / 'products',
        base_dir / 'product-details',
        base_dir / 'dich-vu-khach-hang',
    ]
    
    total_files = 0
    refactored_files = 0
    
    for dir_path in dirs_to_process:
        if not dir_path.exists():
            continue
        
        # Find all HTML files (excluding partials)
        for html_file in dir_path.rglob('*.html'):
            # Skip partials directories
            if 'partials' in str(html_file):
                continue
            
            total_files += 1
            print(f"Processing: {html_file.relative_to(base_dir)}")
            
            try:
                if refactor_file(html_file):
                    refactored_files += 1
                    print(f"  ✓ Refactored")
                else:
                    print(f"  - Already refactored or skipped")
            except Exception as e:
                print(f"  ✗ Error: {e}")
    
    print(f"\n{'='*60}")
    print(f"Total files processed: {total_files}")
    print(f"Files refactored: {refactored_files}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
