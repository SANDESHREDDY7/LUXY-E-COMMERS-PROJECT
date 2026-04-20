-- Insert collections
INSERT INTO collections (name)
SELECT * FROM (SELECT 'Handbags') AS tmp WHERE NOT EXISTS (SELECT 1 FROM collections WHERE name = 'Handbags');
INSERT INTO collections (name)
SELECT * FROM (SELECT 'Crossbody') AS tmp WHERE NOT EXISTS (SELECT 1 FROM collections WHERE name = 'Crossbody');
INSERT INTO collections (name)
SELECT * FROM (SELECT 'Evening') AS tmp WHERE NOT EXISTS (SELECT 1 FROM collections WHERE name = 'Evening');
INSERT INTO collections (name)
SELECT * FROM (SELECT 'Tote') AS tmp WHERE NOT EXISTS (SELECT 1 FROM collections WHERE name = 'Tote');
INSERT INTO collections (name)
SELECT * FROM (SELECT 'Statement') AS tmp WHERE NOT EXISTS (SELECT 1 FROM collections WHERE name = 'Statement');

-- Insert products only if table is empty
INSERT INTO product (name, price, description, image, collections, colors, details)
SELECT * FROM (SELECT
    'Midnight Elegance' AS name,
    4500.00 AS price,
    'Exquisite black leather handbag with gold hardware' AS description,
    'https://images.unsplash.com/photo-1773777145747-b5b7356f4e81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkZXNpZ25lciUyMGhhbmRiYWclMjBibGFja3xlbnwxfHx8fDE3NzUwMzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080' AS image,
    'Handbags' AS collections,
    'Black,Midnight Blue' AS colors,
    'Premium Italian leather|24K gold-plated hardware|Handcrafted detailing|Interior zip pocket|Adjustable shoulder strap' AS details
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = tmp.name);

INSERT INTO product (name, price, description, image, collections, colors, details)
SELECT * FROM (SELECT
    'Sahara Dreams' AS name,
    3800.00 AS price,
    'Timeless beige leather bag with minimalist design' AS description,
    'https://images.unsplash.com/photo-1762019108554-51759e47148a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsZWF0aGVyJTIwYmFnJTIwYmVpZ2V8ZW58MXx8fHwxNzc1MTExMDk3fDA&ixlib=rb-4.1.0&q=80&w=1080' AS image,
    'Crossbody' AS collections,
    'Beige,Camel,Sand' AS colors,
    'Soft calfskin leather|Magnetic closure|Multiple compartments|Detachable chain strap|Limited edition' AS details
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = tmp.name);

INSERT INTO product (name, price, description, image, collections, colors, details)
SELECT * FROM (SELECT
    'Pearl Essence' AS name,
    5200.00 AS price,
    'Sophisticated white designer purse with pearl accents' AS description,
    'https://images.unsplash.com/photo-1774259479601-69a44c70bed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHB1cnNlJTIwd2hpdGUlMjBlbGVnYW50fGVufDF8fHx8MTc3NTExMTA5OHww&ixlib=rb-4.1.0&q=80&w=1080' AS image,
    'Evening' AS collections,
    'White,Ivory' AS colors,
    'Pristine white leather|Pearl embellishments|Silk-lined interior|Gold chain strap|Evening collection' AS details
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = tmp.name);

INSERT INTO product (name, price, description, image, collections, colors, details)
SELECT * FROM (SELECT
    'Heritage Classic' AS name,
    4200.00 AS price,
    'Rich brown leather handbag with vintage charm' AS description,
    'https://images.unsplash.com/photo-1691480150204-66dd1eb77391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwYnJvd24lMjBsZWF0aGVyfGVufDF8fHx8MTc3NTExMTA5OHww&ixlib=rb-4.1.0&q=80&w=1080' AS image,
    'Tote' AS collections,
    'Chocolate,Cognac,Mahogany' AS colors,
    'Full-grain leather|Antique brass hardware|Spacious interior|Top handles|Heritage collection' AS details
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = tmp.name);

INSERT INTO product (name, price, description, image, collections, colors, details)
SELECT * FROM (SELECT
    'Rouge Passion' AS name,
    4800.00 AS price,
    'Bold red designer bag for the modern woman' AS description,
    'https://images.unsplash.com/photo-1773865305860-a7fe9a248f25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGJhZyUyMHJlZCUyMGx1eHVyeXxlbnwxfHx8fDE3NzUxMTEwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080' AS image,
    'Statement' AS collections,
    'Red,Burgundy' AS colors,
    'Vibrant red leather|Contemporary design|Silver hardware|Convertible straps|Modern collection' AS details
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = tmp.name);

INSERT INTO product (name, price, description, image, collections, colors, details)
SELECT * FROM (SELECT
    'Ivory Grace' AS name,
    3600.00 AS price,
    'Elegant cream tote bag for everyday luxury' AS description,
    'https://images.unsplash.com/photo-1611881290645-ed703c866fa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0b3RlJTIwYmFnJTIwY3JlYW18ZW58MXx8fHwxNzc1MTExMDk5fDA&ixlib=rb-4.1.0&q=80&w=1080' AS image,
    'Tote' AS collections,
    'Cream,Off-White,Vanilla' AS colors,
    'Cream pebbled leather|Reinforced handles|Inner pockets|Lightweight design|Everyday collection' AS details
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM product WHERE name = tmp.name);
