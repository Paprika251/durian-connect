import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, TreePine, Search, Filter, MoreHorizontal } from "lucide-react";
import { useState } from 'react';

const TreeStatus = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for trees
  const trees = [
    { id: 'T001', status: 'normal', location: 'แปลง A', lastUpdate: '2024-01-15' },
    { id: 'T002', status: 'flowering', location: 'แปลง A', lastUpdate: '2024-01-14' },
    { id: 'T003', status: 'fruiting', location: 'แปลง A', lastUpdate: '2024-01-13' },
    { id: 'T004', status: 'problem', location: 'แปลง B', lastUpdate: '2024-01-12' },
    { id: 'T005', status: 'normal', location: 'แปลง B', lastUpdate: '2024-01-15' },
    { id: 'T006', status: 'fruiting', location: 'แปลง B', lastUpdate: '2024-01-11' },
  ];

  const statusConfig = {
    normal: { label: 'ปกติ', color: 'bg-green-100 text-green-800 border-green-300', icon: '🌱' },
    problem: { label: 'มีปัญหา', color: 'bg-red-100 text-red-800 border-red-300', icon: '⚠️' },
    flowering: { label: 'ออกดอก', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '🌸' },
    fruiting: { label: 'ออกผล', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '🥭' }
  };

  const statusCounts = {
    total: trees.length,
    normal: trees.filter(t => t.status === 'normal').length,
    problem: trees.filter(t => t.status === 'problem').length,
    flowering: trees.filter(t => t.status === 'flowering').length,
    fruiting: trees.filter(t => t.status === 'fruiting').length,
  };

  const filteredTrees = trees.filter(tree => 
    tree.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tree.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/owner-dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">สถานะต้นทุเรียน</h1>
                <p className="text-muted-foreground">ติดตามสถานะต้นไม้ในสวนทุเรียน</p>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-soft">
              <TreePine className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{statusCounts.total}</div>
                <div className="text-sm text-muted-foreground">ต้นทั้งหมด</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-gradient-to-br from-green-50 to-green-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{statusCounts.normal}</div>
                <div className="text-sm text-green-600">🌱 ปกติ</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-gradient-to-br from-red-50 to-red-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-700">{statusCounts.problem}</div>
                <div className="text-sm text-red-600">⚠️ มีปัญหา</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">{statusCounts.flowering}</div>
                <div className="text-sm text-yellow-600">🌸 ออกดอก</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{statusCounts.fruiting}</div>
                <div className="text-sm text-blue-600">🥭 ออกผล</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="shadow-card border-0 bg-card/80 backdrop-blur mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหารหัสต้น หรือแปลง..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button variant="outline" className="h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  กรอง
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrees.map((tree) => (
              <Card key={tree.id} className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TreePine className="h-5 w-5 text-green-600" />
                      {tree.id}
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{tree.location}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">สถานะ</span>
                      <Badge className={statusConfig[tree.status as keyof typeof statusConfig].color}>
                        {statusConfig[tree.status as keyof typeof statusConfig].icon} {statusConfig[tree.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">อัพเดทล่าสุด</span>
                      <span className="text-sm text-foreground">{tree.lastUpdate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map View Toggle */}
          <div className="mt-8 text-center">
            <Button variant="outline" className="h-12">
              <TreePine className="h-4 w-4 mr-2" />
              ดูแผนที่สวน
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeStatus;