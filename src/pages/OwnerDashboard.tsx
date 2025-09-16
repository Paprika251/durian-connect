import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TreePine, 
  Apple, 
  FileText, 
  Calculator, 
  AlertTriangle, 
  Activity,
  Users,
  BarChart3,
  Eye
} from "lucide-react";

const OwnerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-primary rounded-full shadow-soft">
                <TreePine className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              แผงควบคุมเจ้าของสวน
            </h1>
            <p className="text-muted-foreground">
              จัดการและติดตามสวนทุเรียนของคุณ
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">245</div>
                <div className="text-sm text-muted-foreground">ต้นทุเรียนทั้งหมด</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-muted-foreground">ต้นที่ออกผล</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-muted-foreground">ปัญหาที่รอแก้ไข</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-muted-foreground">ข้อเสนอใหม่</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Tree Status Overview */}
            <Link to="/tree-status">
              <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                      <TreePine className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        สถานะต้นทุเรียน
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        ดูภาพรวมสถานะต้นไม้ในสวน
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    อัพเดทล่าสุด: วันนี้
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Harvest Records */}
            <Link to="/harvest-records">
              <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                      <Apple className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        บันทึกการเก็บเกี่ยว
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        ดูผลผลิตที่เก็บได้แยกตามเกรด
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    เก็บเกี่ยวล่าสุด: เมื่อวาน
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Proposals Review */}
            <Link to="/proposals">
              <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        ข้อเสนอซื้อ
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        พิจารณาข้อเสนอจากผู้รับเหมา
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="text-xs bg-red-100 text-red-800">
                    2 ข้อเสนอใหม่
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Financial Management */}
            <Link to="/financial-overview">
              <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                      <Calculator className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        รายรับ-รายจ่าย
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        ดูและยืนยันรายการเงินของสวน
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    รออนุมัติ: 5 รายการ
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Problem Reports */}
            <Link to="/problem-reports">
              <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        รายงานปัญหา
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        ดูและแก้ไขปัญหาที่แจ้งเข้ามา
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="text-xs bg-yellow-100 text-yellow-800">
                    3 ปัญหารอแก้ไข
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Activity Logs */}
            <Link to="/activity-logs">
              <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        กิจกรรมผู้รับเหมา
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        ติดตามงานที่ผู้รับเหมาทำ
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    อัพเดทล่าสุด: 2 ชม. ที่แล้ว
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;