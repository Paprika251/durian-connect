import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Apple, Calendar, TrendingUp, BarChart3 } from "lucide-react";

const HarvestRecords = () => {
  // Mock data for harvest records
  const harvestData = {
    total: { weight: 2456.8, value: 245680 },
    byGrade: {
      A: { weight: 1234.5, percentage: 50.3, color: 'bg-green-500' },
      B: { weight: 987.2, percentage: 40.2, color: 'bg-blue-500' },
      C: { weight: 156.7, percentage: 6.4, color: 'bg-yellow-500' },
      rejected: { weight: 78.4, percentage: 3.1, color: 'bg-red-500' }
    }
  };

  const recentHarvests = [
    { date: '2024-01-15', gradeA: 45.2, gradeB: 32.1, gradeC: 8.5, rejected: 2.1, total: 87.9 },
    { date: '2024-01-14', gradeA: 52.3, gradeB: 28.7, gradeC: 6.2, rejected: 1.8, total: 89.0 },
    { date: '2024-01-13', gradeA: 38.9, gradeB: 41.2, gradeC: 12.3, rejected: 3.2, total: 95.6 },
    { date: '2024-01-12', gradeA: 61.4, gradeB: 35.8, gradeC: 9.1, rejected: 2.7, total: 109.0 },
    { date: '2024-01-11', gradeA: 48.7, gradeB: 39.3, gradeC: 7.8, rejected: 1.9, total: 97.7 },
  ];

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
                <h1 className="text-3xl font-bold text-foreground">บันทึกการเก็บเกี่ยว</h1>
                <p className="text-muted-foreground">ติดตามผลผลิทุเรียนแยกตามเกรดคุณภาพ</p>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-soft">
              <Apple className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  ผลผลิตรวม
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  {harvestData.total.weight.toLocaleString()} กก.
                </div>
                <p className="text-muted-foreground">
                  มูลค่า ฿{harvestData.total.value.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  เฉลี่ยต่อวัน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {(harvestData.total.weight / 30).toFixed(1)} กก.
                </div>
                <p className="text-muted-foreground">
                  ช่วง 30 วันที่ผ่านมา
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Grade Breakdown */}
          <Card className="shadow-card border-0 bg-card/80 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                การแยกตามเกรดคุณภาพ
              </CardTitle>
              <CardDescription>ผลผลิตแยกตามเกรด A, B, C และตกเกรด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">
                    {harvestData.byGrade.A.weight} กก.
                  </div>
                  <div className="text-sm text-green-600 mb-2">เกรด A</div>
                  <Badge className="bg-green-100 text-green-800">
                    {harvestData.byGrade.A.percentage}%
                  </Badge>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">
                    {harvestData.byGrade.B.weight} กก.
                  </div>
                  <div className="text-sm text-blue-600 mb-2">เกรด B</div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {harvestData.byGrade.B.percentage}%
                  </Badge>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-700">
                    {harvestData.byGrade.C.weight} กก.
                  </div>
                  <div className="text-sm text-yellow-600 mb-2">เกรด C</div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {harvestData.byGrade.C.percentage}%
                  </Badge>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-700">
                    {harvestData.byGrade.rejected.weight} กก.
                  </div>
                  <div className="text-sm text-red-600 mb-2">ตกเกรด</div>
                  <Badge className="bg-red-100 text-red-800">
                    {harvestData.byGrade.rejected.percentage}%
                  </Badge>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                {Object.entries(harvestData.byGrade).map(([grade, data]) => (
                  <div key={grade} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>เกรด {grade.toUpperCase()}</span>
                      <span>{data.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${data.color}`}
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Harvest Records */}
          <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                บันทึกการเก็บเกี่ยวล่าสุด
              </CardTitle>
              <CardDescription>ข้อมูลการเก็บเกี่ยวรายวัน</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-foreground">วันที่</th>
                      <th className="text-right p-3 font-medium text-green-600">เกรด A</th>
                      <th className="text-right p-3 font-medium text-blue-600">เกรด B</th>
                      <th className="text-right p-3 font-medium text-yellow-600">เกรด C</th>
                      <th className="text-right p-3 font-medium text-red-600">ตกเกรด</th>
                      <th className="text-right p-3 font-medium text-foreground">รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentHarvests.map((record, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-3 text-foreground">{record.date}</td>
                        <td className="p-3 text-right text-green-600 font-medium">{record.gradeA} กก.</td>
                        <td className="p-3 text-right text-blue-600 font-medium">{record.gradeB} กก.</td>
                        <td className="p-3 text-right text-yellow-600 font-medium">{record.gradeC} กก.</td>
                        <td className="p-3 text-right text-red-600 font-medium">{record.rejected} กก.</td>
                        <td className="p-3 text-right text-foreground font-bold">{record.total} กก.</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HarvestRecords;