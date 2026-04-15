#!/usr/bin/env python3
"""Prepare individual article input files for parallel generation."""
import json
import os

with open('/home/ubuntu/lucid-path/client/src/data/articles.json') as f:
    data = json.load(f)

os.makedirs('/home/ubuntu/article-inputs', exist_ok=True)

for i, article in enumerate(data['articles']):
    input_data = {
        'id': article['id'],
        'title': article['title'],
        'slug': article['slug'],
        'category': article['category'],
        'categoryName': article['categoryName'],
        'openerType': article['openerType'],
        'opener': article['opener'],
        'livedExperience': article['livedExperience'],
        'namedReference': article.get('namedReference', {}),
        'sections': article['sections'],
        'selectedPhrases': article['selectedPhrases'],
        'conclusionType': article['conclusionType'],
        'conclusion': article['conclusion'],
        'backlinkType': article.get('backlinkType', ''),
        'outboundLink': article.get('outboundLink', ''),
        'internalLinks': article.get('internalLinks', []),
    }
    
    filepath = f'/home/ubuntu/article-inputs/article-{i:03d}.json'
    with open(filepath, 'w') as f:
        json.dump(input_data, f)

print(f"Prepared {len(data['articles'])} article input files")
