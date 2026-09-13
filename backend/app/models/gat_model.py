"""
Graph Attention Network adapter.

Structurally identical to the GCN adapter but replaces convolution with
`torch_geometric.nn.GATConv` attention layers, letting the model learn which
neighbouring aircraft are most relevant to a target node's risk rather than
weighting all neighbours equally. Reported here as a genuine negative
result: near-perfect ROC-AUC alongside a collapsed F1 score at this dataset
scale — worth surfacing to the UI rather than hiding.
"""
MODEL_NAME = "Graph Attention Network"
F1 = 0.0094
ROC_AUC = 0.942
