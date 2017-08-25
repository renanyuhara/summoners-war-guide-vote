$(document).ready(function() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/api/monster',
        beforeSend: function() {
            
            $('#content').hide();
            $('#content').empty();
            $('#loading').fadeIn(200);
        },
        success: function(data) {
            if (data.success) {
                var content = '';

                if (data.monster.length <= 0) {
                    content = 'Sorry. No monster found. Come back later.'
                } else {
                    content += '<table>';
                    content += '<tr>';
                    content += '<td>Family Name</td>';
                    content += '<td>Awakened Name</td>';
                    content += '<td>Element</td>';
                    content += '<td>Vote Column Description</td>';
                    content += '<td>Number of Votes</td>';

                    var previousMonsterId = -1;
                    for (var i in data.monster) {
                        if (data.monster.hasOwnProperty(i)) {
                            var element = data.monster[i];
                            if (element.id_monster != previousMonsterId) {
                                content += '</tr>';
                                content += '<tr>';
                                content += '<td>';
                                content += element.family_name;
                                content += '</td>';
                                content += '<td>';
                                content += element.awakened_name;
                                content += '</td>';
                                content += '<td>';
                                content += element.element;
                                content += '</td>';
                                content += '<td>';
                                content += element.vote_column_description;
                                content += '</td>';
                                content += '<td>';
                                content += element.number_of_votes                            
                                content += '</td>';
                            } else {
                                content += '<td>';
                                content += element.vote_column_description;
                                content += '</td>';
                            }
                            console.log(element.id_monster);
                            previousMonsterId = element.id_monster;
                        }
                    }
                    content += '</tr>';
                    content += '</table>';
                }

                $("#content").html(content);
            } else {
                $('#content').html('Failed to connect' );
            }
        },
        error: function(a,b,c) {
            console.log(a);
            console.log(b);
            console.log(c);
        },
        complete: function() {
            $('#content').fadeIn(200);
            $('#loading').fadeOut(200);
        }
    });
});