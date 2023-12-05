let data = [
    [{id: 'Chaos'}],
    [
      {id: 'Gaea', parents: ['Chaos']},
      {id: 'Uranus'}
    ],
    [
      {id: 'Oceanus', parents: ['Gaea', 'Uranus']},
      {id: 'Thethys', parents: ['Gaea', 'Uranus']},
      {id: 'Pontus'},
      {id: 'Rhea', parents: ['Gaea', 'Uranus']},
      {id: 'Cronus', parents: ['Gaea', 'Uranus']},
      {id: 'Coeus', parents: ['Gaea', 'Uranus']},
      {id: 'Phoebe', parents: ['Gaea', 'Uranus']},
      {id: 'Crius', parents: ['Gaea', 'Uranus']},
      {id: 'Hyperion', parents: ['Gaea', 'Uranus']},
      {id: 'Iapetus', parents: ['Gaea', 'Uranus']},
      {id: 'Thea', parents: ['Gaea', 'Uranus']},
      {id: 'Themis', parents: ['Gaea', 'Uranus']},
      {id: 'Mnemosyne', parents: ['Gaea', 'Uranus']}
    ],
    [
      {id: 'Doris', parents: ['Oceanus', 'Thethys']},
      {id: 'Neures', parents: ['Pontus', 'Gaea']},
      {id: 'Dionne'},
      {id: 'Demeter', parents: ['Rhea', 'Cronus']},
      {id: 'Hades', parents: ['Rhea', 'Cronus']},
      {id: 'Hera', parents: ['Rhea', 'Cronus']},
      {id: 'Alcmene'},
      {id: 'Zeus', parents: ['Rhea', 'Cronus']},
      {id: 'Eris'},
      {id: 'Leto', parents: ['Coeus', 'Phoebe']},
      {id: 'Amphitrite'},
      {id: 'Medusa'},
      {id: 'Poseidon', parents: ['Rhea', 'Cronus']},
      {id: 'Hestia', parents: ['Rhea', 'Cronus']}
    ],
    [
      {id: 'Thetis', parents: ['Doris', 'Neures']},
      {id: 'Peleus'},
      {id: 'Anchises'},
      {id: 'Adonis'},
      {id: 'Aphrodite', parents: ['Zeus', 'Dionne']},
      {id: 'Persephone', parents: ['Zeus', 'Demeter']},
      {id: 'Ares', parents: ['Zeus', 'Hera']},
      {id: 'Hephaestus', parents: ['Zeus', 'Hera']},
      {id: 'Hebe', parents: ['Zeus', 'Hera']},
      {id: 'Hercules', parents: ['Zeus', 'Alcmene']},
      {id: 'Megara'},
      {id: 'Deianira'},
      {id: 'Eileithya', parents: ['Zeus', 'Hera']},
      {id: 'Ate', parents: ['Zeus', 'Eris']},
      {id: 'Leda'},
      {id: 'Athena', parents: ['Zeus']},
      {id: 'Apollo', parents: ['Zeus', 'Leto']},
      {id: 'Artemis', parents: ['Zeus', 'Leto']},
      {id: 'Triton', parents: ['Poseidon', 'Amphitrite']},
      {id: 'Pegasus', parents: ['Poseidon', 'Medusa']},
      {id: 'Orion', parents: ['Poseidon']},
      {id: 'Polyphemus', parents: ['Poseidon']}
    ],
    [
      {id: 'Deidamia'},
      {id: 'Achilles', parents: ['Peleus', 'Thetis']},
      {id: 'Creusa'},
      {id: 'Aeneas', parents: ['Anchises', 'Aphrodite']},
      {id: 'Lavinia'},
      {id: 'Eros', parents: ['Hephaestus', 'Aphrodite']},
      {id: 'Helen', parents: ['Leda', 'Zeus']},
      {id: 'Menelaus'},
      {id: 'Polydueces', parents: ['Leda', 'Zeus']}
    ],
    [
      {id: 'Andromache'},
      {id: 'Neoptolemus', parents: ['Deidamia', 'Achilles']},
      {id: 'Aeneas(2)', parents: ['Creusa', 'Aeneas']},
      {id: 'Pompilius', parents: ['Creusa', 'Aeneas']},
      {id: 'Iulus', parents: ['Lavinia', 'Aeneas']},
      {id: 'Hermione', parents: ['Helen', 'Menelaus']}
    ]
  ]
  
export function prepareTangledTreeData(levels) {
 
  // precompute level depth
  levels.forEach((l, i) => l.forEach(n => (n.level = i)));

  var nodes = levels.reduce((a, x) => a.concat(x), []);
  var nodes_index = {};
  nodes.forEach(d => (nodes_index[d.id] = d));

  // objectification
  nodes.forEach(d => {
    d.parents = (d.parents === undefined ? [] : d.parents).map(p => nodes_index[p]);
  });

  // precompute bundles
  // ... the rest of the logic
  levels.forEach((l, i) => {
    var index = {}
    l.forEach(n => {
      if(n.parents.length == 0) {
        return
      }
      
      var id = n.parents.map(d => d.id).sort().join('--')
      if (id in index) {
        index[id].parents = index[id].parents.concat(n.parents)
      }
      else {
        index[id] = {id: id, parents: n.parents.slice(), level: i}
      }
      n.bundle = index[id]
    })
    l.bundles = Object.keys(index).map(k => index[k])
    l.bundles.forEach((b, i) => b.i = i)
  })
  
  var links = []
  nodes.forEach(d => {
    d.parents.forEach(p => links.push({source: d, bundle: d.bundle, target: p}))
  })
  
  var bundles = levels.reduce( ((a,x) => a.concat(x.bundles)), [] )
  
  // layout
  const node_height = 16
  const node_width = 80
  const bundle_width = 16
  const level_y_padding = 16
  
  var x_offset = 0
  var y_offset = 0
  levels.forEach(l => {
    x_offset += l.bundles.length*bundle_width
    y_offset += level_y_padding
    l.forEach((n, i) => {
      n.x = n.level*node_width + x_offset + node_height/2
      n.y = i*node_height + y_offset
    })
    y_offset += l.length*node_height
  })
  
  var i = 0
  levels.forEach(l => {
    l.bundles.forEach(b => {
      b.x = b.parents[0].x + node_width + (l.bundles.length-1-b.i)*bundle_width
      b.y = i*node_height
    })
    i += l.length
  })
    
  links.forEach(l => {
    l.xt = l.target.x
    l.yt = l.target.y
    l.xb = l.bundle.x
    l.yb = l.bundle.y
    l.xs = l.source.x
    l.ys = l.source.y
  })
  
  var layout = {
    height: nodes.length * node_height + levels.length * level_y_padding,
    node_height,
    node_width,
    bundle_width
  }

  // Return the processed data, which is then used by the Svelte component
  return { levels, nodes, nodes_index, links, bundles, layout };
}
