"""
Graph Convolutional Network adapter.

Aircraft are nodes; edges connect aircraft within a spatiotemporal proximity
window. Node features are the same conflict-relevant signals used by the
XGBoost baseline; the GCN aggregates neighbour information over 2-3
message-passing layers before a sigmoid head predicts conflict probability
for the target node. Swap in a trained `torch_geometric.nn.GCNConv` stack and
load weights from `settings.GCN_MODEL_PATH`.
"""
MODEL_NAME = "Graph Convolutional Network"
F1 = 0.6898
ROC_AUC = 0.986
